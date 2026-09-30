

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.services.ai_service import generate_response

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatRequest(BaseModel):
    message: str


@router.post("")
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        reply = generate_response(request.message)
        return {
            "user": current_user.username,
            "response": reply,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
