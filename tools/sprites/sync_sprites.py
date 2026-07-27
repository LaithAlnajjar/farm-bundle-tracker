#!/usr/bin/env python3
"""Re-fetch the game sprites the frontend renders.

Pulls artwork from the Stardew Valley Wiki, undoes the wiki's integer upscale so
each file is back at its native resolution, and writes it into
apps/frontend/public/assets. Run from anywhere:

    python3 tools/sprites/sync_sprites.py

Item titles are derived from the backend catalog seed, so adding an item there
and re-running is enough to pick up its sprite.

Requires: requests, pillow.
"""

from __future__ import annotations

import io
import re
import sys
import time
from pathlib import Path

import requests
from PIL import Image

REPO = Path(__file__).resolve().parents[2]
CATALOG = REPO / "apps/backend/src/modules/catalogs/infrastructure/seed/data/catalog.items.ts"
ASSETS = REPO / "apps/frontend/public/assets"

API = "https://stardewvalleywiki.com/mediawiki/api.php"
SESSION = requests.Session()
SESSION.headers["User-Agent"] = "farm-bundle-tracker sprite sync (personal project)"

# Catalog names whose wiki file is not just the name with underscores.
ITEM_TITLE_OVERRIDES = {
    "Large Egg (Brown)": "Large_Brown_Egg.png",
    "Large Egg (White)": "Large_Egg.png",
}

# UI glyphs, keyed by the IconName the frontend uses.
ICONS = {
    "coin": "Gold.png",
    "crocus": "Crocus.png",
    "daffodil": "Daffodil.png",
    "egg": "Egg.png",
    "fish": "Sardine.png",
    "gem": "Diamond.png",
    "jar": "Honey.png",  # the Preserves Jar sprite is 16x32 and would squash
    "junimo": "Junimo.gif",
    "logs": "Wood.png",
    "mushroom": "Red_Mushroom.png",
    "parsnip": "Parsnip.png",
    "pumpkin": "Pumpkin.png",
    "quality-gold": "Gold_Quality_Icon.png",
    "quality-iridium": "Iridium_Quality_Icon.png",
    "quality-silver": "Silver_Quality_Icon.png",
    "soup": "Pumpkin_Soup.png",
    "sprout": "Tea_Sapling.png",
    "star": "Stardrop.png",
    "sunflower": "Sunflower.png",
}

# `check` and `pin` have no in-game sprite; draw_glyphs.py owns those two.
HAND_DRAWN = ("check", "pin")

# Junimo Note bundle pouches, one tone per community-center room.
ROOMS = {
    f"bundle-{tone}": f"Bundle_{tone.capitalize()}.png"
    for tone in ("blue", "green", "orange", "purple", "red", "teal", "yellow")
}

# Villager portraits handed out as farmhand avatars.
AVATARS = {
    name: f"{name.capitalize()}.png"
    for name in (
        "abigail", "alex", "elliott", "emily", "haley", "harvey",
        "leah", "maru", "penny", "sam", "sebastian", "shane",
    )
}


def catalog_items() -> dict[str, str]:
    """Map catalog slug -> item name, read straight out of the seed module."""
    body = CATALOG.read_text().split("export const catalogItems = {", 1)[1]
    pattern = re.compile(
        r"^  '?([a-z0-9-]+)'?:\s*item\(\s*(?:'([^']+)'|\"([^\"]+)\")", re.M | re.S
    )
    return {m.group(1): m.group(2) or m.group(3) for m in pattern.finditer(body)}


def resolve(titles: list[str]) -> dict[str, str]:
    """Ask the wiki where each File: page's image actually lives."""
    urls: dict[str, str] = {}
    for start in range(0, len(titles), 40):
        chunk = titles[start : start + 40]
        response = SESSION.get(
            API,
            params={
                "action": "query",
                "titles": "|".join(f"File:{t}" for t in chunk),
                "prop": "imageinfo",
                "iiprop": "url",
                "format": "json",
            },
            timeout=30,
        )
        response.raise_for_status()
        query = response.json()["query"]
        for page in query["pages"].values():
            info = page.get("imageinfo")
            if info:
                urls[page["title"].removeprefix("File:")] = info[0]["url"]
        for norm in query.get("normalized", []):
            target = norm["to"].removeprefix("File:")
            if target in urls:
                urls[norm["from"].removeprefix("File:")] = urls[target]
        time.sleep(0.2)
    return urls


def fetch(url: str, dest: Path, upscale: int) -> None:
    """Download one sprite and divide out the wiki's fixed upscale factor."""
    data = SESSION.get(url, timeout=30).content
    image = Image.open(io.BytesIO(data)).convert("RGBA")
    if image.width % upscale or image.height % upscale:
        raise SystemExit(f"{dest.name}: {image.size} is not a {upscale}x render")
    image = image.resize((image.width // upscale, image.height // upscale), Image.NEAREST)
    dest.parent.mkdir(parents=True, exist_ok=True)
    image.save(dest, optimize=True)
    time.sleep(0.1)


def main() -> int:
    items = {
        slug: ITEM_TITLE_OVERRIDES.get(name, name.replace(" ", "_") + ".png")
        for slug, name in catalog_items().items()
    }
    # The wiki renders 16px item art at 3x and 64px portraits at 2x.
    groups: list[tuple[Path, dict[str, str], int]] = [
        (ASSETS / "items", items, 3),
        (ASSETS / "icons", ICONS, 3),
        (ASSETS / "rooms", ROOMS, 3),
        (ASSETS / "avatars", AVATARS, 2),
    ]

    titles = sorted({t for _, group, _ in groups for t in group.values()})
    urls = resolve(titles)
    missing = [t for t in titles if t not in urls]

    synced = 0
    for directory, group, upscale in groups:
        for slug, title in group.items():
            if title in urls:
                fetch(urls[title], directory / f"{slug}.png", upscale)
                synced += 1

    print(f"synced {synced} sprites from {len(titles)} wiki files")
    print(f"hand-drawn glyphs left untouched: {', '.join(HAND_DRAWN)}")
    for title in missing:
        print(f"missing on the wiki: {title}", file=sys.stderr)
    return 1 if missing else 0


if __name__ == "__main__":
    raise SystemExit(main())
