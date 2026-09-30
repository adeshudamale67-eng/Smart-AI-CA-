from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_response(prompt: str) -> str:
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "user", "content": prompt}
        ],
    )
    return response.choices[0].message.content


def analyze_document(text: str):
    prompt = f"""
You are an expert Chartered Accountant AI.

First identify the document type.

Possible types:
- Invoice
- GST Return
- Balance Sheet
- Profit & Loss Statement
- Bank Statement
- Salary Slip
- Tax Notice
- General Document

Return ONLY valid JSON.

Format:

{{
    "document_type": "",
    "summary": "",
    "important_details": [
        "...",
        "..."
    ],
    "risks": [
        "..."
    ],
    "recommendations": [
        "..."
    ]
}}

Document:
{text[:12000]}
"""

    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "You are a Chartered Accountant with expertise in taxation, GST, auditing, and finance. Always return valid JSON only."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
    )

    response = completion.choices[0].message.content.strip()

    # Remove Markdown code fences if the model wraps the JSON
    if response.startswith("```json"):
        response = response.replace("```json", "", 1)
    elif response.startswith("```"):
        response = response.replace("```", "", 1)

    if response.endswith("```"):
        response = response[:-3]

    response = response.strip()

    try:
        return json.loads(response)
    except Exception as e:
        print("JSON parsing failed:", e)
        print("Raw response:")
        print(response)
        return {
            "document_type": "Unknown",
            "summary": response,
            "important_details": [],
            "risks": [],
            "recommendations": []
        }
