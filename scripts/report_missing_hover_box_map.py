import csv
import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Dict, List, Optional

import requests

SUPABASE_URL = "https://ttiwmcrfahbczzehmyds.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0aXdtY3JmYWhiY3p6ZWhteWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NzE2ODQsImV4cCI6MjA4NzE0NzY4NH0.dpS222gT1P9jG-8qylWh24ymUyAjjZvvI_7v7C6ZuM0"

HEADERS = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
}

ROOT_DIR = Path(__file__).resolve().parents[1]
HOVER_MAP_PATH = ROOT_DIR / "src" / "data" / "ring-hover-box-map.json"
REPORT_JSON_PATH = ROOT_DIR / "scripts" / "ring-hover-missing-report.json"
REPORT_CSV_PATH = ROOT_DIR / "scripts" / "ring-hover-missing-report.csv"
PRIORITY_CSV_PATH = ROOT_DIR / "scripts" / "ring-hover-upload-priority.csv"

ColorMap = Dict[str, List[dict]]


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
            f"?select=_parent_id,_order,image_url&order=_parent_id,_order&offset={offset}&limit=1000",
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


def load_hover_map() -> Dict[str, Dict[str, str]]:
    with HOVER_MAP_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def write_csv_rows(rows: List[dict]) -> None:
    fieldnames = [
        "slug",
        "color",
        "available_image_count",
        "available_orders",
        "available_image_urls",
    ]
    with REPORT_CSV_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def write_priority_csv_rows(rows: List[dict]) -> None:
    fieldnames = [
        "priority",
        "slug",
        "color",
        "reason",
        "available_image_count",
        "available_orders",
        "available_image_urls",
    ]
    with PRIORITY_CSV_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def main() -> None:
    ring_id_to_slug = fetch_active_rings()
    images = fetch_images()
    hover_map = load_hover_map()

    ring_images: Dict[str, ColorMap] = defaultdict(lambda: defaultdict(list))

    for row in images:
        slug = ring_id_to_slug.get(row["_parent_id"])
        if not slug:
            continue

        color = detect_color_from_url(row["image_url"])
        if not color:
            continue

        ring_images[slug][color].append(
            {
                "order": int(row.get("_order") or 0),
                "image_url": row["image_url"],
            }
        )

    for by_color in ring_images.values():
        for image_rows in by_color.values():
            image_rows.sort(key=lambda x: x["order"])

    colors_missing_counter: Counter = Counter()
    rings_without_any_hover: List[str] = []
    missing_entries: List[dict] = []
    csv_rows: List[dict] = []
    priority_rows: List[dict] = []

    for slug in sorted(ring_id_to_slug.values()):
        available_by_color = ring_images.get(slug, {})
        available_colors = sorted(available_by_color.keys())
        mapped_colors = sorted((hover_map.get(slug) or {}).keys())

        if not mapped_colors:
            rings_without_any_hover.append(slug)

        missing_colors = [color for color in available_colors if color not in mapped_colors]
        if not missing_colors:
            continue

        details = {}
        for color in missing_colors:
            rows = available_by_color[color]
            priority = "P0" if not mapped_colors else "P1"
            reason = (
                "no hover mapping for this ring"
                if priority == "P0"
                else "partial hover mapping; this color still missing"
            )
            details[color] = {
                "image_count": len(rows),
                "orders": [r["order"] for r in rows],
                "image_urls": [r["image_url"] for r in rows],
            }
            colors_missing_counter[color] += 1
            csv_rows.append(
                {
                    "slug": slug,
                    "color": color,
                    "available_image_count": len(rows),
                    "available_orders": "|".join(str(r["order"]) for r in rows),
                    "available_image_urls": "|".join(r["image_url"] for r in rows),
                }
            )
            priority_rows.append(
                {
                    "priority": priority,
                    "slug": slug,
                    "color": color,
                    "reason": reason,
                    "available_image_count": len(rows),
                    "available_orders": "|".join(str(r["order"]) for r in rows),
                    "available_image_urls": "|".join(r["image_url"] for r in rows),
                }
            )

        missing_entries.append(
            {
                "slug": slug,
                "available_colors": available_colors,
                "mapped_colors": mapped_colors,
                "missing_colors": missing_colors,
                "details": details,
            }
        )

    summary = {
        "total_active_rings": len(ring_id_to_slug),
        "rings_present_in_hover_map": len(hover_map),
        "rings_with_any_missing_color": len(missing_entries),
        "missing_color_groups": len(csv_rows),
        "rings_without_any_hover_mapping": len(rings_without_any_hover),
        "missing_color_count": {
            "yellow": int(colors_missing_counter.get("yellow", 0)),
            "white": int(colors_missing_counter.get("white", 0)),
            "rose": int(colors_missing_counter.get("rose", 0)),
        },
        "rings_without_any_hover_mapping_list": rings_without_any_hover,
    }

    report = {
        "summary": summary,
        "rings_with_missing_hover": missing_entries,
    }

    with REPORT_JSON_PATH.open("w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    write_csv_rows(csv_rows)
    priority_rows.sort(key=lambda row: (row["priority"], row["slug"], row["color"]))
    write_priority_csv_rows(priority_rows)

    print("Generated missing hover report")
    print(f"- total_active_rings: {summary['total_active_rings']}")
    print(f"- rings_with_any_missing_color: {summary['rings_with_any_missing_color']}")
    print(f"- missing_color_groups: {summary['missing_color_groups']}")
    print(
        "- rings_without_any_hover_mapping: "
        f"{summary['rings_without_any_hover_mapping']}"
    )
    print(f"- json: {REPORT_JSON_PATH}")
    print(f"- csv: {REPORT_CSV_PATH}")
    print(f"- priority_csv: {PRIORITY_CSV_PATH}")


if __name__ == "__main__":
    main()
