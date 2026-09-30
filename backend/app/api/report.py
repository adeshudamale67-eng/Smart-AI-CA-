from fastapi.responses import FileResponse
from fastapi import APIRouter, HTTPException
from app.services.ai_service import analyze_document as analyze_document_ai
import os

from app.services.document_service import extract_pdf_text
from app.services.report_service import generate_report

router = APIRouter()


@router.post("/analyze")
def analyze_report(filename: str):
    file_path = os.path.join("uploads", filename)
    print(f"Checking file: {file_path}")

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    text = extract_pdf_text(file_path)
    analysis = analyze_document_ai(text)

    return {
        "filename": filename,
        "analysis": analysis
    }


@router.post("/generate-report")
def create_report(filename: str):
    file_path = os.path.join("uploads", filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    text = extract_pdf_text(file_path)
    analysis = analyze_document_ai(text)

    pdf_path = generate_report(analysis, filename)

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=os.path.basename(pdf_path)
    )
