from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "output" / "endcard-current-domain.png"
W, H = 1080, 1920
NAVY = (5, 25, 47)
TEAL = (45, 205, 205)
WHITE = (245, 251, 254)
MUTED = (177, 207, 218)


def font(size: int, bold: bool = False):
    face = "segoeuib.ttf" if bold else "segoeui.ttf"
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / face), size)


def arabic(value: str) -> str:
    return get_display(arabic_reshaper.reshape(value))


def centered(draw, value, y, face, color, is_arabic=False):
    rendered = arabic(value) if is_arabic else value
    box = draw.textbbox((0, 0), rendered, font=face)
    draw.text(((W - (box[2] - box[0])) / 2, y), rendered, font=face, fill=color)


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    frame = Image.new("RGB", (W, H))
    pixels = frame.load()
    for y in range(H):
        progress = y / H
        row = (int(NAVY[0] + 4 * progress), int(NAVY[1] + 19 * progress), int(NAVY[2] + 19 * progress))
        for x in range(W):
            pixels[x, y] = row

    draw = ImageDraw.Draw(frame)
    draw.ellipse((-390, -370, 360, 380), outline=(22, 91, 105), width=4)
    draw.ellipse((680, 1460, 1460, 2240), outline=(22, 91, 105), width=4)
    draw.rounded_rectangle((415, 305, 665, 550), radius=54, outline=TEAL, width=7)
    draw.line([(440, 432), (478, 432), (500, 392), (528, 478), (560, 407), (584, 432), (639, 432)], fill=TEAL, width=9, joint="curve")

    centered(draw, "فرضيات تمريضية", 645, font(94, True), WHITE, True)
    centered(draw, "Nursing Hypotheses", 775, font(48, True), MUTED)
    centered(draw, "سيناريوهات تفاعلية · بنك أسئلة · متابعة التقدم", 935, font(44), WHITE, True)
    centered(draw, "بالعربية والإنجليزية، وعلى جوالك", 1020, font(43), MUTED, True)

    draw.rounded_rectangle((100, 1240, 980, 1405), radius=35, fill=(239, 250, 252))
    centered(draw, "nursinghypotheses.com", 1282, font(58, True), (9, 50, 67))
    centered(draw, "ابدأ تجربتك الآن", 1475, font(46, True), TEAL, True)
    draw.line((220, 1675, 860, 1675), fill=(48, 112, 124), width=2)
    centered(draw, "Abdulkarim alhejaili", 1710, font(39), MUTED)
    frame.save(OUT, optimize=True)
    print(OUT)


if __name__ == "__main__":
    main()
