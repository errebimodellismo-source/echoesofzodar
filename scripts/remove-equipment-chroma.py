from pathlib import Path
from PIL import Image


ROOT = Path("public/assets/equip")


def is_green_key(r, g, b):
    return (
        (g > 145 and r < 125 and b < 125 and g > r * 1.45 and g > b * 1.45)
        or (g > 215 and r < 145 and b < 145)
    )


def despill(r, g, b):
    if g > 90 and g > r * 1.15 and g > b * 1.15:
        g = max(r, b, int(g * 0.55))
    return r, g, b


def process(path):
    image = Image.open(path).convert("RGBA")
    next_pixels = []
    for r, g, b, a in image.getdata():
        if is_green_key(r, g, b):
            next_pixels.append((r, g, b, 0))
        else:
            r, g, b = despill(r, g, b)
            next_pixels.append((r, g, b, a))
    image.putdata(next_pixels)
    image.save(path)


def main():
    files = sorted(ROOT.glob("base_*.png"))
    for file in files:
        process(file)
    print(f"processed={len(files)}")


if __name__ == "__main__":
    main()
