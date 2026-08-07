import io
from pypdf import PdfReader
from fastapi import HTTPException


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """PDF bytes se saara text nikalta hai. Agar PDF khali ya scanned image ho to error deta hai."""
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
    except Exception:
        raise HTTPException(status_code=400, detail="Ye file valid PDF nahi lag rahi. Kripya sahi PDF upload karein.")

    if len(reader.pages) == 0:
        raise HTTPException(status_code=400, detail="PDF me koi page nahi mila.")

    text_parts = []
    for page in reader.pages:
        page_text = page.extract_text() or ""
        text_parts.append(page_text)

    full_text = "\n".join(text_parts).strip()

    if len(full_text) < 30:
        raise HTTPException(
            status_code=400,
            detail="PDF se text nahi nikal paaya. Ho sakta hai ye scanned image PDF ho — kripya text-based PDF upload karein.",
        )

    return full_text
