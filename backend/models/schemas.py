from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Enums
class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class VisibilityStatus(str, Enum):
    PRIVATE = "private"
    PUBLIC = "public"
    SYNCED = "synced"


class CreationMode(str, Enum):
    REAL_PERSON = "real_person"  # Mode 1
    ORIGINAL = "original"  # Mode 2
    CONCEPT = "concept"  # Mode 3
    VIRTUAL_IP = "virtual_ip"  # Mode 4


# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    username: str = Field(..., min_length=3, max_length=50)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str


# BaZi Profile Schemas
class BaZiProfileCreate(BaseModel):
    birth_year: int = Field(..., ge=1900, le=2100)
    birth_month: int = Field(..., ge=1, le=12)
    birth_day: int = Field(..., ge=1, le=31)
    birth_hour: int = Field(..., ge=0, le=23)
    birth_minute: int = Field(..., ge=0, le=59)
    gender: Gender
    birth_location: Optional[str] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    use_true_solar_time: bool = True


class BaZiPillar(BaseModel):
    """Represents a pillar in BaZi (Year/Month/Day/Hour)"""
    stem: str  # 天干
    branch: str  # 地支
    hidden_stems: List[str] = []  # 藏干
    ten_god: Optional[str] = None  # 十神


class BaZiProfileResponse(BaseModel):
    id: str
    user_id: str
    
    # Birth Information
    birth_year: int
    birth_month: int
    birth_day: int
    birth_hour: int
    birth_minute: int
    gender: Gender
    
    # BaZi Data
    year_pillar: BaZiPillar
    month_pillar: BaZiPillar
    day_pillar: BaZiPillar
    hour_pillar: BaZiPillar
    
    # Calculated Fields
    day_master: str  # 日主 (Day Stem)
    bazi_string: str  # Complete 8 characters
    
    # Analysis (simplified for MVP)
    primary_element: Optional[str] = None
    personality_summary: Optional[str] = None
    
    created_at: datetime
    updated_at: datetime


# Character Schemas
class CharacterCreate(BaseModel):
    character_name: str = Field(..., min_length=1, max_length=100)
    creation_mode: CreationMode
    description: Optional[str] = Field(None, max_length=2000)
    
    # BaZi Data (will be calculated)
    birth_year: int = Field(..., ge=1900, le=2100)
    birth_month: int = Field(..., ge=1, le=12)
    birth_day: int = Field(..., ge=1, le=31)
    birth_hour: Optional[int] = Field(None, ge=0, le=23)
    birth_minute: Optional[int] = Field(None, ge=0, le=59)
    gender: Gender = Gender.OTHER
    
    # Optional fields
    greeting_message: Optional[str] = Field(None, max_length=500)
    personality_traits: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    
    # Visibility
    visibility_status: VisibilityStatus = VisibilityStatus.PRIVATE


class CharacterUpdate(BaseModel):
    character_name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=2000)
    greeting_message: Optional[str] = Field(None, max_length=500)
    personality_traits: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    visibility_status: Optional[VisibilityStatus] = None


class CharacterResponse(BaseModel):
    id: str
    creator_id: str
    character_name: str
    creation_mode: CreationMode
    description: Optional[str]
    
    # BaZi Data
    bazi_profile: BaZiProfileResponse
    
    # Interaction Data
    greeting_message: Optional[str]
    personality_traits: List[str]
    tags: List[str]
    
    # Stats
    interaction_count: int = 0
    favorite_count: int = 0
    
    # Visibility
    visibility_status: VisibilityStatus
    deep_dialogue_unlocked: bool
    
    # Avatar
    avatar_url: Optional[str] = None
    
    # Timestamps
    created_at: datetime
    updated_at: datetime


class CharacterListResponse(BaseModel):
    characters: List[CharacterResponse]
    total: int
    page: int
    page_size: int


# Chat Schemas
class ChatMessageCreate(BaseModel):
    character_id: str
    message: str = Field(..., min_length=1, max_length=2000)


class ChatMessageResponse(BaseModel):
    id: str
    conversation_id: str
    character_id: str
    user_id: str
    message: str
    response: str
    created_at: datetime


class ConversationResponse(BaseModel):
    id: str
    character_id: str
    user_id: str
    messages: List[ChatMessageResponse]
    created_at: datetime
    updated_at: datetime

