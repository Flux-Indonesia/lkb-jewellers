import concurrent.futures
import json
from typing import Dict, List, Optional, Tuple

import numpy as np
import requests
from PIL import Image
from io import BytesIO

SUPABASE_URL = "https://ttiwmcrfahbczzehmyds.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0aXdtY3JmYWhiY3p6ZWhteWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NzE2ODQsImV4cCI6MjA4NzE0NzY4NH0.dpS222gT1P9jG-8qylWh24ymUyAjjZvvI_7v7C6ZuM0"

HEADERS = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
}

BLACK_RATIO_THRESHOLD = 0.07
VERY_DARK_RATIO_THRESHOLD = 0.05
BRIGHT_RATIO_MIN = 0.05
BRIGHT_RATIO_MAX = 0.35
SATURATION_MEAN_MIN = 0.10
SATURATION_MEAN_MAX = 0.25
MAX_WORKERS = 24


def fetch_active_rings() -> Dict[str, str]:
    rings: Dict[str, str] = {}
    offset = 0
    while True:
        res = requests.get(
            f"{SUPABASE_URL}/rest/v1/engagement_rings"
            f"?select=id,slug&is_active=eq.true&order=slug&offset={offset}&limit=1000",
            headers=HEADERS,
            timeout=60,
        )
        res.raise_for_status()
        rows = res.json()
        if not rows:
            break
        for row in rows:
            rings[row["id"]] = row["slug"]
        if len(rows) < 1000:
            break
        offset += len(rows)
    return rings


def fetch_images() -> List[dict]:
    images: List[dict] = []
    offset = 0
    while True:
        res = requests.get(
            f"{SUPABASE_URL}/rest/v1/engagement_ring_images"
            f"?select=id,_parent_id,_order,image_url&order=_parent_id,_order&offset={offset}&limit=1000",
            headers=HEADERS,
            timeout=60,
        )
        res.raise_for_status()
        rows = res.json()
        if not rows:
            break
        images.extend(rows)
        if len(rows) < 1000:
            break
        offset += len(rows)
    return images


def detect_color_from_url(url: str) -> Optional[str]:
    filename = url.split("/")[-1].lower()
    for color in ("yellow", "white", "rose"):
        if filename.startswith(f"{color}_"):
            return color
    return None


def to_render_url(url: str) -> str:
    marker = "/storage/v1/object/public/"
    if marker not in url:
        return url
    transformed = url.replace(marker, "/storage/v1/render/image/public/")
    return transformed + "?width=128&quality=35&resize=cover"


def calc_image_features(image_bytes: bytes) -> Dict[str, float]:
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    arr = np.asarray(image, dtype=np.float32)
    gray = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
    max_channel = np.max(arr, axis=2)
    min_channel = np.min(arr, axis=2)
    saturation = np.where(max_channel == 0, 0, (max_channel - min_channel) / (max_channel + 1e-6))
    return {
        "black_ratio": float((gray < 35).mean()),
        "very_dark_ratio": float((gray < 20).mean()),
        "bright_ratio": float((gray > 180).mean()),
        "saturation_mean": float(saturation.mean()),
    }


def score_image(row: dict) -> Tuple[str, Optional[Dict[str, float]]]:
    url = row["image_url"]
    try:
        res = requests.get(to_render_url(url), timeout=30)
        if res.status_code != 200:
            return row["id"], None
        features = calc_image_features(res.content)
        return row["id"], features
    except Exception:
        return row["id"], None


def is_black_box_candidate(features: Dict[str, float]) -> bool:
    return (
        features["black_ratio"] >= BLACK_RATIO_THRESHOLD
        and features["very_dark_ratio"] >= VERY_DARK_RATIO_THRESHOLD
        and BRIGHT_RATIO_MIN <= features["bright_ratio"] <= BRIGHT_RATIO_MAX
        and SATURATION_MEAN_MIN <= features["saturation_mean"] <= SATURATION_MEAN_MAX
    )


def main() -> None:
    ring_id_to_slug = fetch_active_rings()
    images = fetch_images()

    image_rows: List[dict] = []
    for row in images:
        slug = ring_id_to_slug.get(row["_parent_id"])
        if not slug:
            continue
        color = detect_color_from_url(row["image_url"])
        if not color:
            continue
        image_rows.append(
            {
                "id": row["id"],
                "slug": slug,
                "color": color,
                "order": int(row.get("_order") or 0),
                "image_url": row["image_url"],
            }
        )

    features_by_id: Dict[str, Optional[Dict[str, float]]] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [executor.submit(score_image, row) for row in image_rows]
        total = len(futures)
        completed = 0
        for future in concurrent.futures.as_completed(futures):
            image_id, features = future.result()
            features_by_id[image_id] = features
            completed += 1
            if completed % 250 == 0:
                print(f"Scored {completed}/{total}")

    grouped: Dict[str, Dict[str, List[dict]]] = {}
    for row in image_rows:
        features = features_by_id.get(row["id"])
        if features is None:
            continue
        row_with_score = {**row, **features}
        grouped.setdefault(row["slug"], {}).setdefault(row["color"], []).append(row_with_score)

    hover_map: Dict[str, Dict[str, str]] = {}
    color_groups = 0
    accepted_groups = 0
    for slug, by_color in grouped.items():
        for color, rows in by_color.items():
            color_groups += 1
            candidates = [row for row in rows if is_black_box_candidate(row)]
            if not candidates:
                continue
            best = max(
                candidates,
                key=lambda r: (
                    r["black_ratio"],
                    r["very_dark_ratio"],
                    -abs(r["bright_ratio"] - 0.12),
                    -abs(r["saturation_mean"] - 0.152),
                    -r["order"],
                ),
            )
            if is_black_box_candidate(best):
                hover_map.setdefault(slug, {})[color] = best["image_url"]
                accepted_groups += 1

    with open("src/data/ring-hover-box-map.json", "w", encoding="utf-8") as f:
        json.dump(hover_map, f, indent=2, sort_keys=True)

    with open("scripts/ring-hover-box-report.json", "w", encoding="utf-8") as f:
        json.dump(
            {
                "rings_with_hover_box": len(hover_map),
                "total_active_rings": len(ring_id_to_slug),
                "total_color_groups": color_groups,
                "accepted_color_groups": accepted_groups,
                "black_ratio_threshold": BLACK_RATIO_THRESHOLD,
                "very_dark_ratio_threshold": VERY_DARK_RATIO_THRESHOLD,
                "bright_ratio_min": BRIGHT_RATIO_MIN,
                "bright_ratio_max": BRIGHT_RATIO_MAX,
                "saturation_mean_min": SATURATION_MEAN_MIN,
                "saturation_mean_max": SATURATION_MEAN_MAX,
            },
            f,
            indent=2,
        )

    print(f"Generated map for {len(hover_map)} rings")


if __name__ == "__main__":
    main()
