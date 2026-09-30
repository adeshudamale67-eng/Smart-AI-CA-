from datetime import datetime, timedelta
from jose import jwt

# Secret key (replace with an environment variable in production)
SECRET_KEY = "AI_CA_Assistant_Super_Secret_Key_2026"

# JWT algorithm
ALGORITHM = "HS256"

# Token expiry
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def create_access_token(data: dict):
    """
    Create a JWT access token.
    """
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt
