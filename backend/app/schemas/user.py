from pydantic import BaseModel, EmailStr, ConfigDict


# Schema for user registration
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    username: str
    password: str


# Schema for login
class UserLogin(BaseModel):
    username: str
    password: str


# Schema for API responses
class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    username: str

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str
