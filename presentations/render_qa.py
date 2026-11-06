"""Render the generated PDF into slide PNGs and compact contact sheets."""

from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image, ImageDraw


HERE = Path(__file__).resolve().parent
PDF = HERE / "qa" / "CourtOMeter_LawEcon_Colloquium_Draft_v1.pdf"
RENDERED = HERE / "qa" / "rendered"
RENDERED.mkdir(parents=True, exist_ok=True)


def main() -> None:
    document = pdfium.PdfDocument(PDF)
    slides: list[Image.Image] = []
    for index, page in enumerate(document):
        slide = page.render(scale=120 / 72).to_pil().convert("RGB")
        slide.save(RENDERED / f"slide-{index + 1:02d}.png")
        slides.append(slide)

    cell_w, cell_h = 520, 320
    for sheet_index in range(0, len(slides), 9):
        group = slides[sheet_index:sheet_index + 9]
        sheet = Image.new("RGB", (cell_w * 3, cell_h * 3), "#D9D9D9")
        draw = ImageDraw.Draw(sheet)
        for offset, slide in enumerate(group):
            thumb = slide.copy()
            thumb.thumbnail((cell_w - 24, cell_h - 30), Image.Resampling.LANCZOS)
            col, row = offset % 3, offset // 3
            x = col * cell_w + (cell_w - thumb.width) // 2
            y = row * cell_h + 22
            sheet.paste(thumb, (x, y))
            draw.text((col * cell_w + 8, row * cell_h + 5), f"Slide {sheet_index + offset + 1}", fill="#222222")
        sheet.save(RENDERED / f"contact-{sheet_index // 9 + 1}.png")


if __name__ == "__main__":
    main()
