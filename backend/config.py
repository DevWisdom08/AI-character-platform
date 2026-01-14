from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "XwanAI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_PREFIX: str = "/api"
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_KEY: str
    
    # OpenAI
    OPENAI_API_KEY: str
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

