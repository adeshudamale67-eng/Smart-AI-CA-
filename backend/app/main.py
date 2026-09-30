from fastapi import FastAPI
from app.api.upload import router as upload_router
from app.api.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from app.api.chat import router as chat_router
from app.database.database import Base, engine
from app.models.user import User
from fastapi import Depends
from app.dependencies.auth import get_current_user
from app.api.report import router as report_router

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI CA Assistant",
    description="Backend API for AI CA Assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3000",
        "http://localhost:3000",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(upload_router)
app.include_router(report_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to AI CA Assistant 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/profile")
def profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name
    }
