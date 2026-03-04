"""
download_missing_photos.py
Download foto engagement ring yang kurang dari Cullen CDN.

Usage:
    python scripts/download_missing_photos.py                    # semua ring yang kurang
    python scripts/download_missing_photos.py --ring ring-rose   # ring spesifik
    python scripts/download_missing_photos.py --target 15        # target foto per ring (default: 15)
    python scripts/download_missing_photos.py --dry-run          # preview tanpa download
"""

from __future__ import annotations

import argparse
import io
import json
import math
import re
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

# Tambahkan scripts/ ke path agar bisa import dari sana
sys.path.insert(0, str(Path(__file__).parent))

import requests
from PIL import Image

from process_and_upload import process_image, upload_to_supabase

SUPABASE_URL = "https://ttiwmcrfahbczzehmyds.supabase.co"
ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    ".eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0aXdtY3JmYWhiY3p6ZWhteWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NzE2ODQsImV4cCI6MjA4NzE0NzY4NH0"
    ".dpS222gT1P9jG-8qylWh24ymUyAjjZvvI_7v7C6ZuM0"
)
HEADERS = {"apikey": ANON_KEY, "Authorization": f"Bearer {ANON_KEY}"}
PROGRESS_FILE = Path("scripts/download_progress.json")

CULLEN_TO_OUR_COLOR = {
    "Yellow": "yellow",
    "Rose": "rose",
    "White": "white",
    "Platinum": "platinum",
}

IMAGE_RE = re.compile(r"/([^/]+)_(\d+)\.jpg$", re.IGNORECASE)
RENDER_RE = re.compile(r"/renders/([^/]+)/(.+)$", re.IGNORECASE)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Download missing ring photos from Cullen CDN")
    parser.add_argument("--ring", help="Slug ring spesifik, contoh: ring-rose")
    parser.add_argument("--target", type=int, default=15, help="Target total foto per ring")
    parser.add_argument("--dry-run", action="store_true", help="Preview tanpa download/upload")
    return parser.parse_args()


def load_progress() -> dict[str, list[str]]:
    if not PROGRESS_FILE.exists():
        return {"done": [], "errors": []}
    try:
        data = json.loads(PROGRESS_FILE.read_text(encoding="utf-8"))
        done = data.get("done", []) if isinstance(data, dict) else []
        errors = data.get("errors", []) if isinstance(data, dict) else []
        return {"done": list(done), "errors": list(errors)}
    except Exception:
        return {"done": [], "errors": []}


def save_progress(progress: dict[str, list[str]]) -> None:
    PROGRESS_FILE.write_text(json.dumps(progress, indent=2), encoding="utf-8")


def fetch_all_rows(endpoint: str, select: str, order: str) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    offset = 0
    limit = 1000

    while True:
        resp = requests.get(
            f"{SUPABASE_URL}/rest/v1/{endpoint}",
            headers={**HEADERS, "Range": f"{offset}-{offset + limit - 1}"},
            params={"select": select, "order": order},
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        if not data:
            break
        rows.extend(data)
        if len(data) < limit:
            break
        offset += limit
    return rows


def fetch_ring_state() -> tuple[dict[str, dict[str, Any]], dict[str, list[dict[str, Any]]]]:
    rings_raw = fetch_all_rows(
        endpoint="engagement_rings",
        select="id,slug,name",
        order="slug.asc",
    )
    images_raw = fetch_all_rows(
        endpoint="engagement_ring_images",
        select="_parent_id,_order,image_url",
        order="_parent_id.asc,_order.asc",
    )

    rings: dict[str, dict[str, Any]] = {}
    for ring in rings_raw:
        slug = ring.get("slug")
        if not slug:
            continue
        rings[slug] = {
            "id": ring.get("id"),
            "slug": slug,
            "name": ring.get("name") or slug,
        }

    images_by_parent: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in images_raw:
        parent_id = row.get("_parent_id")
        if parent_id:
            images_by_parent[parent_id].append(row)

    return rings, images_by_parent


def get_cullen_counts(slug: str) -> dict[str, Any] | None:
    url = f"https://www.cullenjewellery.com/engagement-rings/{slug}/__data.json"
    resp = requests.get(
        url,
        headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"},
        timeout=20,
    )
    resp.raise_for_status()
    data = resp.json()

    for node in data.get("nodes", []):
        if node is None:
            continue
        if not isinstance(node, dict) or node.get("type") != "data":
            continue
        flat = node.get("data", [])
        media_urls = [value for value in flat if isinstance(value, str) and "media.cullen" in value]
        if not media_urls:
            continue

        colors: dict[str, int] = {}
        for value in media_urls:
            match = re.search(r"/renders/[^/]+/([^/]+)/", value)
            if not match:
                continue
            color = match.group(1)
            colors[color] = colors.get(color, 0) + 1

        jpg_names = [
            value
            for value in flat
            if isinstance(value, str) and ".jpg" in value and "shopify" not in value
        ]
        mp4_names = [value for value in flat if isinstance(value, str) and ".mp4" in value]

        return {
            "total_media": len(media_urls),
            "total_imgs": len(jpg_names),
            "total_vids": len(mp4_names),
            "by_color": colors,
        }
    return None


def _collect_strings(value: Any, out: list[str]) -> None:
    if isinstance(value, str):
        out.append(value)
        return
    if isinstance(value, list):
        for item in value:
            _collect_strings(item, out)
        return
    if isinstance(value, dict):
        for item in value.values():
            _collect_strings(item, out)


def _carat_score(carat_segment: str) -> float:
    match = re.search(r"(\d+(?:\.\d+)?)", carat_segment)
    if not match:
        return 9_999.0
    value = float(match.group(1))
    return abs(value - 1.0)


def get_cullen_urls(slug: str) -> dict[str, list[str]]:
    url = f"https://www.cullenjewellery.com/engagement-rings/{slug}/__data.json"
    resp = requests.get(
        url,
        headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"},
        timeout=20,
    )
    resp.raise_for_status()

    data = resp.json()
    flat_strings: list[str] = []
    _collect_strings(data.get("nodes", []), flat_strings)
    ring_folder = slug.replace("ring-", "")
    ring_segment = f"/products/rings/{ring_folder}/"

    per_color: dict[str, list[tuple[float, str]]] = defaultdict(list)
    valid_colors = set(CULLEN_TO_OUR_COLOR)
    for value in flat_strings:
        lower = value.lower()
        if "media.cullen" not in lower:
            continue
        if ring_segment not in lower:
            continue
        if ".mp4" in lower:
            continue

        match = RENDER_RE.search(value)
        if not match:
            continue

        carat_segment = match.group(1)
        suffix = match.group(2)
        path_parts = [part for part in suffix.split("/") if part]

        color = ""
        for part in path_parts:
            if part in valid_colors:
                color = part
                break
        if not color:
            continue

        score = _carat_score(carat_segment)
        per_color[color].append((score, value))

    result: dict[str, list[str]] = {}
    for color, pairs in per_color.items():
        deduped: dict[str, float] = {}
        for score, link in pairs:
            if link not in deduped or score < deduped[link]:
                deduped[link] = score
        sorted_urls = [url for url, _ in sorted(deduped.items(), key=lambda item: (item[1], item[0]))]
        result[color] = sorted_urls
    return result


def parse_existing_color_counts(rows: list[dict[str, Any]]) -> tuple[dict[str, int], int, int]:
    color_counts: dict[str, int] = defaultdict(int)
    max_order = 0

    for row in rows:
        image_url = row.get("image_url") or ""
        match = IMAGE_RE.search(image_url)
        if match:
            color = match.group(1).lower()
            number = int(match.group(2))
            color_counts[color] = max(color_counts[color], number)

        order_value = row.get("_order")
        if isinstance(order_value, int):
            max_order = max(max_order, order_value)

    return dict(color_counts), max_order, len(rows)


def insert_image_row(ring_id: str, order_value: int, image_url: str) -> bool:
    insert_url = f"{SUPABASE_URL}/rest/v1/engagement_ring_images"
    payload = {
        "_parent_id": ring_id,
        "_order": order_value,
        "image_url": image_url,
        "thumbnail_url": image_url,
    }
    resp = requests.post(
        insert_url,
        json=payload,
        headers={**HEADERS, "Prefer": "return=minimal"},
        timeout=30,
    )
    return resp.status_code in (200, 201)


def plan_color_targets(
    target: int,
    current_total: int,
    existing: dict[str, int],
    available_colors: list[str],
) -> dict[str, int]:
    if not available_colors:
        return {}

    per_color_target = math.ceil(target / len(available_colors))
    deficits = {color: max(0, per_color_target - existing.get(color, 0)) for color in available_colors}

    remaining_total = max(0, target - current_total)
    if remaining_total <= 0:
        return {color: 0 for color in available_colors}

    planned: dict[str, int] = {color: 0 for color in available_colors}
    ordered_colors = sorted(available_colors, key=lambda color: (deficits[color] == 0, color))

    for color in ordered_colors:
        if remaining_total <= 0:
            break
        take = min(deficits[color], remaining_total)
        planned[color] = take
        remaining_total -= take

    if remaining_total > 0:
        for color in ordered_colors:
            if remaining_total <= 0:
                break
            planned[color] += 1
            remaining_total -= 1

    return planned


def process_single_image(cullen_url: str, storage_path: str) -> tuple[bool, str]:
    try:
        resp = requests.get(
            cullen_url,
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=30,
        )
        resp.raise_for_status()

        img = Image.open(io.BytesIO(resp.content)).convert("RGB")
        result = process_image(img)
        upload_ok = upload_to_supabase(result, storage_path)
        if not upload_ok:
            return False, "upload gagal"
        return True, "OK"
    except Exception as exc:
        return False, str(exc)


def main() -> None:
    args = parse_args()
    progress = load_progress()
    done_set = set(progress.get("done", []))

    print(f"Mode: {'DRY-RUN' if args.dry_run else 'LIVE'} | Target: {args.target}")
    print("Ambil data rings + image state dari Supabase...")
    rings, images_by_parent = fetch_ring_state()

    if args.ring and args.ring not in rings:
        print(f"[ERROR] Ring tidak ditemukan: {args.ring}")
        return

    selected = [rings[args.ring]] if args.ring else sorted(rings.values(), key=lambda item: item["slug"])

    total_uploaded = 0
    total_skipped = 0
    total_errors = 0

    for ring in selected:
        ring_id = ring["id"]
        if not ring_id:
            print(f"\n[{ring['slug']}] skip: id kosong")
            total_skipped += 1
            continue

        existing_rows = images_by_parent.get(ring_id, [])
        existing_counts, max_order, total_existing = parse_existing_color_counts(existing_rows)

        if total_existing >= args.target and not args.ring:
            continue

        print(f"\n[{ring['slug']}] {ring['name']} | existing={total_existing} | max_order={max_order}")

        try:
            cullen_counts = get_cullen_counts(ring["slug"])
            if cullen_counts:
                by_color = ", ".join(
                    f"{key}:{value}" for key, value in sorted(cullen_counts["by_color"].items())
                )
                print(
                    f"  Cullen media={cullen_counts['total_media']} "
                    f"imgs={cullen_counts['total_imgs']} vids={cullen_counts['total_vids']} | {by_color}"
                )
        except Exception as exc:
            print(f"  [WARN] gagal ambil counts Cullen: {exc}")

        try:
            cullen_urls = get_cullen_urls(ring["slug"])
        except Exception as exc:
            print(f"  [WARN] gagal fetch Cullen API ({ring['slug']}): {exc}")
            total_skipped += 1
            continue

        available_colors = []
        for cullen_color in sorted(cullen_urls):
            mapped = CULLEN_TO_OUR_COLOR.get(cullen_color)
            if mapped:
                available_colors.append(mapped)

        available_colors = sorted(set(available_colors))
        if not available_colors:
            print("  [WARN] tidak ada URL gambar valid dari Cullen")
            total_skipped += 1
            continue

        plan = plan_color_targets(
            target=args.target,
            current_total=total_existing,
            existing=existing_counts,
            available_colors=available_colors,
        )

        planned_total = sum(plan.values())
        if planned_total <= 0:
            print("  Sudah memenuhi target / tidak perlu tambahan")
            continue

        print(
            "  Plan per color: "
            + ", ".join(
                f"{color}:+{plan[color]} (current={existing_counts.get(color, 0)})"
                for color in available_colors
            )
        )

        next_counts = dict(existing_counts)
        next_order = max_order

        for cullen_color in sorted(cullen_urls):
            color_key = CULLEN_TO_OUR_COLOR.get(cullen_color)
            if not color_key:
                continue

            needed = plan.get(color_key, 0)
            if needed <= 0:
                print(f"    - {color_key}: skip (sudah cukup)")
                continue

            candidates = cullen_urls[cullen_color]
            if not candidates:
                print(f"    - {color_key}: skip (tidak ada candidate)")
                total_skipped += needed
                continue

            print(f"    - {color_key}: need={needed}, candidates={len(candidates)}")

            taken = 0
            for cullen_url in candidates:
                if taken >= needed:
                    break

                next_num = next_counts.get(color_key, 0) + 1
                progress_key = f"{ring['slug']}:{color_key}:{next_num}"
                if progress_key in done_set:
                    next_counts[color_key] = next_num
                    next_order += 1
                    taken += 1
                    print(f"      [DONE] {progress_key} (resume)")
                    continue

                ring_folder = ring["slug"].replace("ring-", "")
                storage_path = f"rings/{ring_folder}/{color_key}_{next_num}.jpg"
                image_url = f"{SUPABASE_URL}/storage/v1/object/public/engagement-rings/{storage_path}"

                print(f"      [{taken + 1}/{needed}] {color_key}_{next_num}.jpg")
                print(f"        src: {cullen_url}")

                if args.dry_run:
                    next_counts[color_key] = next_num
                    next_order += 1
                    taken += 1
                    total_skipped += 1
                    continue

                upload_ok, upload_msg = process_single_image(cullen_url, storage_path)
                if not upload_ok:
                    print(f"        [ERROR] upload/process gagal: {upload_msg}")
                    progress["errors"].append(f"{progress_key} | {upload_msg}")
                    total_errors += 1
                    continue

                next_order += 1
                inserted = insert_image_row(ring_id=ring_id, order_value=next_order, image_url=image_url)
                if not inserted:
                    print("        [ERROR] insert DB gagal")
                    progress["errors"].append(f"{progress_key} | insert DB gagal")
                    total_errors += 1
                    continue

                next_counts[color_key] = next_num
                taken += 1
                total_uploaded += 1
                done_set.add(progress_key)
                progress["done"] = sorted(done_set)
                save_progress(progress)
                print(f"        [OK] uploaded + inserted (_order={next_order})")

            if taken < needed:
                missing = needed - taken
                total_skipped += missing
                print(f"      [WARN] kurang source untuk {color_key}: sisa {missing}")

        progress["done"] = sorted(done_set)
        save_progress(progress)

    print("\n=== RESULT ===")
    print(f"Uploaded: {total_uploaded}")
    print(f"Skipped : {total_skipped}")
    print(f"Errors  : {total_errors}")
    print(f"Progress: {PROGRESS_FILE}")


if __name__ == "__main__":
    main()
