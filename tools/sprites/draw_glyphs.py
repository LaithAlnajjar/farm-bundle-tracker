"""Hand-drawn 16x16 glyphs for the two UI marks Stardew has no sprite for.

Writes check.png and pin.png straight into apps/frontend/public/assets/icons."""

from pathlib import Path

from PIL import Image

ICONS = Path(__file__).resolve().parents[2] / "apps/frontend/public/assets/icons"

OUTLINE = (60, 40, 26, 255)


def outline(px, size=16, colour=OUTLINE):
    """Wrap every opaque run in a 1px dark border, the way game sprites are drawn."""
    filled = {p for p, c in px.items() if c[3]}
    for x, y in list(filled):
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)):
            n = (x + dx, y + dy)
            if 0 <= n[0] < size and 0 <= n[1] < size and n not in filled:
                px.setdefault(n, colour)
    return px


def save(px, name, size=16):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    for (x, y), c in px.items():
        im.putpixel((x, y), c)
    ICONS.mkdir(parents=True, exist_ok=True)
    im.save(ICONS / name, optimize=True)


# --- check: a chunky tick in the Junimo-note green ---------------------------
LEAF = (106, 178, 60, 255)
LEAF_LIT = (155, 214, 96, 255)
LEAF_DARK = (74, 130, 44, 255)

check = {}
stroke = []
for i in range(4):  # down-right leg
    stroke += [(3 + i, 7 + i), (3 + i, 8 + i), (4 + i, 8 + i)]
for i in range(7):  # up-right leg
    stroke += [(6 + i, 10 - i), (7 + i, 10 - i), (6 + i, 11 - i)]
for x, y in stroke:
    if 0 <= x < 16 and 0 <= y < 16:
        check[(x, y)] = LEAF
for x, y in list(check):  # top edge highlight, bottom edge shade
    if (x, y - 1) not in check:
        check[(x, y)] = LEAF_LIT
    elif (x, y + 1) not in check:
        check[(x, y)] = LEAF_DARK
save(outline(check), "check.png")


# --- pin: a pushpin for the cork board ---------------------------------------
RED = (190, 58, 48, 255)
RED_LIT = (232, 108, 92, 255)
RED_DARK = (140, 36, 32, 255)
STEEL = (176, 176, 184, 255)
STEEL_DARK = (112, 112, 124, 255)

pin = {}
head_rows = {2: (6, 10), 3: (5, 11), 4: (5, 11), 5: (5, 11), 6: (6, 10)}
for y, (a, b) in head_rows.items():
    for x in range(a, b):
        pin[(x, y)] = RED
for x, y in ((6, 3), (7, 3), (6, 4)):  # specular
    pin[(x, y)] = RED_LIT
for x, y in ((9, 5), (8, 6), (9, 4)):
    pin[(x, y)] = RED_DARK
for x in range(6, 10):  # collar
    pin[(x, 7)] = STEEL
for y in range(8, 13):  # needle
    pin[(7, y)] = STEEL
    pin[(8, y)] = STEEL_DARK
pin[(7, 13)] = STEEL_DARK
save(outline(pin), "pin.png")

print(f"drew check.png + pin.png into {ICONS}")
