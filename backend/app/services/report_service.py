from datetime import datetime
import os

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    ListFlowable,
    ListItem,
)


def generate_report(analysis: dict, filename: str):
    """
    Generate a professional PDF report from document analysis.
    """

    # Create reports folder
    reports_dir = "reports"
    os.makedirs(reports_dir, exist_ok=True)

    # Create output filename
    base_name = os.path.splitext(os.path.basename(filename))[0]
    pdf_filename = f"{base_name}_AI_Report.pdf"
    pdf_path = os.path.join(reports_dir, pdf_filename)

    # PDF document
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        spaceAfter=12,
    )

    heading_style = ParagraphStyle(
        "ReportHeading",
        parent=styles["Heading2"],
        spaceBefore=12,
        spaceAfter=6,
    )

    body_style = ParagraphStyle(
        "ReportBody",
        parent=styles["BodyText"],
        leading=16,
        spaceAfter=8,
    )

    bullet_style = ParagraphStyle(
        "ReportBullet",
        parent=styles["BodyText"],
        leading=15,
    )

    story = []

    # Title
    story.append(
        Paragraph("AI CA Assistant Report", title_style)
    )

    # Generated date
    generated_on = datetime.now().strftime("%d %B %Y %I:%M %p")

    story.append(
        Paragraph(
            f"<b>Generated On:</b> {generated_on}",
            body_style,
        )
    )

    story.append(Spacer(1, 8))

    # Document Type
    story.append(
        Paragraph("Document Type", heading_style)
    )

    story.append(
        Paragraph(
            str(analysis.get("document_type", "Unknown")),
            body_style,
        )
    )

    # Summary
    story.append(
        Paragraph("Summary", heading_style)
    )

    story.append(
        Paragraph(
            str(analysis.get("summary", "")),
            body_style,
        )
    )

    # Important Details
    story.append(
        Paragraph("Important Details", heading_style)
    )

    important_details = analysis.get("important_details", [])

    if important_details:
        story.append(
            ListFlowable(
                [
                    ListItem(
                        Paragraph(str(item), bullet_style)
                    )
                    for item in important_details
                ],
                bulletType="bullet",
                leftIndent=20,
            )
        )
    else:
        story.append(
            Paragraph("No important details identified.", body_style)
        )

    # Risks
    story.append(
        Paragraph("Risks", heading_style)
    )

    risks = analysis.get("risks", [])

    if risks:
        story.append(
            ListFlowable(
                [
                    ListItem(
                        Paragraph(str(risk), bullet_style)
                    )
                    for risk in risks
                ],
                bulletType="bullet",
                leftIndent=20,
            )
        )
    else:
        story.append(
            Paragraph("No significant risks identified.", body_style)
        )

    # Recommendations
    story.append(
        Paragraph("Recommendations", heading_style)
    )

    recommendations = analysis.get("recommendations", [])

    if recommendations:
        story.append(
            ListFlowable(
                [
                    ListItem(
                        Paragraph(str(rec), bullet_style)
                    )
                    for rec in recommendations
                ],
                bulletType="bullet",
                leftIndent=20,
            )
        )
    else:
        story.append(
            Paragraph("No recommendations available.", body_style)
        )

    # Build PDF
    doc.build(story)

    return pdf_path
