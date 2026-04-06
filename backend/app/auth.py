from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from app.config import settings
import hashlib
import hmac

# Simple SHA-256 based password hashing (compatible with all Python versions)
def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def _verify_password(plain_password: str, hashed_password: str) -> bool:
    return hmac.compare_digest(
        hashlib.sha256(plain_password.encode()).hexdigest(),
        hashed_password
    )

DUMMY_USERS = {
    "admin": {
        "username": "admin",
        "full_name": "Admin User",
        "hashed_password": _hash_password("admin123"),
        "role": "admin",
    }
}


def get_user(username: str) -> Optional[dict]:
    return DUMMY_USERS.get(username)


def authenticate_user(username: str, password: str) -> Optional[dict]:
    user = get_user(username)
    if not user:
        return None
    if not _verify_password(password, user["hashed_password"]):
        return None
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
