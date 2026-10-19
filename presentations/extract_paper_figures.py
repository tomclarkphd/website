"""Render selected Court-O-Meter paper pages and crop presentation assets."""

from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "files" / "CourtOMeterPaperv5-npsf.pdf"
ASSETS = Path(__file__).resolve().parent / "assets"
ASSETS.mkdir(parents=True, exist_ok=True)


def render(pdf: pdfium.PdfDocument, page_number: int) -> Image.Image:
    page = pdf[page_number - 1]
    return page.render(scale=150 / 72).to_pil().convert("RGB")


def save_crop(image: Image.Image, name: str, box: tuple[int, int, int, int]) -> None:
    image.crop(box).save(ASSETS / name, quality=95)


def main() -> None:
    pdf = pdfium.PdfDocument(PDF)
    pages = {number: render(pdf, number) for number in (14, 18, 19, 23, 26, 28, 31)}

    for number, image in pages.items():
        image.save(ASSETS / f"paper-page-{number}.png")

    save_crop(pages[14], "figure-1-pipeline.png", (250, 120, 1035, 520))
    save_crop(pages[18], "figure-2-classifier-validation.png", (250, 110, 1025, 675))
    save_crop(pages[23], "figure-4-ideology-validation.png", (350, 135, 955, 1000))

    # Figures 3 and 6 were typeset sideways on portrait pages.
    figure3_page = pages[19].rotate(-90, expand=True)
    save_crop(figure3_page, "figure-3-trends.png", (105, 95, 1535, 1010))

    save_crop(pages[28], "figure-6-emotion.png", (135, 265, 1195, 1150))
    save_crop(pages[28], "figure-6-intensity.png", (215, 250, 700, 1115))
    save_crop(pages[28], "figure-6-anger.png", (715, 250, 1210, 1115))
    save_crop(pages[28], "figure-6-intensity-random.png", (205, 250, 705, 700))
    save_crop(pages[28], "figure-6-anger-random.png", (710, 250, 1215, 700))

    save_crop(pages[26], "figure-5-polarization.png", (40, 80, 1235, 450))
    save_crop(pages[31], "table-3-age-partisanship.png", (135, 65, 1135, 550))


if __name__ == "__main__":
    main()
