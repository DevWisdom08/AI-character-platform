from fastapi import APIRouter, HTTPException, status, Header, Query
from typing import Optional, List
from models.schemas import (
    CharacterCreate, CharacterUpdate, CharacterResponse, 
    CharacterListResponse, VisibilityStatus, BaZiProfileResponse
)
from database import get_supabase
from utils.bazi_calculator import calculate_bazi_profile
from utils.ai_service import AIService
from datetime import datetime
import uuid

router = APIRouter()


def get_user_from_token(authorization: str):
    """Extract user from authorization header"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
    
    token = authorization.replace("Bearer ", "")
    supabase = get_supabase()
    
    try:
        user = supabase.auth.get_user(token)
        return user.user.id if user else None
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


@router.post("/create", response_model=CharacterResponse, status_code=status.HTTP_201_CREATED)
async def create_character(
    character_data: CharacterCreate,
    authorization: str = Header(None)
):
    """Create a new character"""
    user_id = get_user_from_token(authorization)
    supabase = get_supabase()
    
    try:
        # Calculate BaZi for character
        hour = character_data.birth_hour if character_data.birth_hour is not None else 12
        minute = character_data.birth_minute if character_data.birth_minute is not None else 0
        
        bazi_data = calculate_bazi_profile(
            birth_year=character_data.birth_year,
            birth_month=character_data.birth_month,
            birth_day=character_data.birth_day,
            birth_hour=hour,
            birth_minute=minute,
            gender=character_data.gender.value,
            use_true_solar_time=True
        )
        
        # Generate greeting if not provided
        greeting = character_data.greeting_message
        if not greeting:
            greeting = AIService.generate_character_greeting(
                character_name=character_data.character_name,
                personality_summary=bazi_data["personality_summary"],
                bazi_string=bazi_data["bazi_string"]
            )
        
        # Determine deep dialogue unlock
        deep_dialogue = character_data.visibility_status in [
            VisibilityStatus.PRIVATE,
            VisibilityStatus.SYNCED
        ]
        
        # Prepare character record
        character_id = str(uuid.uuid4())
        db_data = {
            "id": character_id,
            "creator_id": user_id,
            "character_name": character_data.character_name,
            "creation_mode": character_data.creation_mode.value,
            "description": character_data.description,
            "greeting_message": greeting,
            "personality_traits": character_data.personality_traits or [],
            "tags": character_data.tags or [],
            "visibility_status": character_data.visibility_status.value,
            "deep_dialogue_unlocked": deep_dialogue,
            "bazi_year": character_data.birth_year,
            "bazi_month": character_data.birth_month,
            "bazi_day": character_data.birth_day,
            "bazi_hour": hour,
            "bazi_minute": minute,
            "gender": character_data.gender.value,
            "year_stem": bazi_data["year_pillar"]["stem"],
            "year_branch": bazi_data["year_pillar"]["branch"],
            "month_stem": bazi_data["month_pillar"]["stem"],
            "month_branch": bazi_data["month_pillar"]["branch"],
            "day_stem": bazi_data["day_pillar"]["stem"],
            "day_branch": bazi_data["day_pillar"]["branch"],
            "hour_stem": bazi_data["hour_pillar"]["stem"],
            "hour_branch": bazi_data["hour_pillar"]["branch"],
            "day_master": bazi_data["day_master"],
            "bazi_string": bazi_data["bazi_string"],
            "primary_element": bazi_data["primary_element"],
            "personality_summary": bazi_data["personality_summary"],
            "bazi_data": bazi_data,
            "interaction_count": 0,
            "favorite_count": 0,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table("characters").insert(db_data).execute()
        
        # Build response
        return CharacterResponse(
            id=character_id,
            creator_id=user_id,
            character_name=character_data.character_name,
            creation_mode=character_data.creation_mode,
            description=character_data.description,
            bazi_profile=BaZiProfileResponse(
                id=character_id,
                user_id=user_id,
                birth_year=character_data.birth_year,
                birth_month=character_data.birth_month,
                birth_day=character_data.birth_day,
                birth_hour=hour,
                birth_minute=minute,
                gender=character_data.gender,
                year_pillar=bazi_data["year_pillar"],
                month_pillar=bazi_data["month_pillar"],
                day_pillar=bazi_data["day_pillar"],
                hour_pillar=bazi_data["hour_pillar"],
                day_master=bazi_data["day_master"],
                bazi_string=bazi_data["bazi_string"],
                primary_element=bazi_data["primary_element"],
                personality_summary=bazi_data["personality_summary"],
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ),
            greeting_message=greeting,
            personality_traits=character_data.personality_traits or [],
            tags=character_data.tags or [],
            interaction_count=0,
            favorite_count=0,
            visibility_status=character_data.visibility_status,
            deep_dialogue_unlocked=deep_dialogue,
            avatar_url=None,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating character: {str(e)}"
        )


@router.get("/my-characters", response_model=CharacterListResponse)
async def get_my_characters(
    authorization: str = Header(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    """Get all characters created by current user"""
    user_id = get_user_from_token(authorization)
    supabase = get_supabase()
    
    try:
        # Get total count
        count_result = supabase.table("characters").select("id", count="exact").eq("creator_id", user_id).execute()
        total = count_result.count if count_result.count else 0
        
        # Get paginated data
        offset = (page - 1) * page_size
        result = supabase.table("characters").select("*").eq("creator_id", user_id).range(offset, offset + page_size - 1).execute()
        
        characters = []
        for data in result.data:
            bazi_data = data.get("bazi_data", {})
            
            char = CharacterResponse(
                id=data["id"],
                creator_id=data["creator_id"],
                character_name=data["character_name"],
                creation_mode=data["creation_mode"],
                description=data.get("description"),
                bazi_profile=BaZiProfileResponse(
                    id=data["id"],
                    user_id=data["creator_id"],
                    birth_year=data["bazi_year"],
                    birth_month=data["bazi_month"],
                    birth_day=data["bazi_day"],
                    birth_hour=data["bazi_hour"],
                    birth_minute=data["bazi_minute"],
                    gender=data["gender"],
                    year_pillar=bazi_data.get("year_pillar", {}),
                    month_pillar=bazi_data.get("month_pillar", {}),
                    day_pillar=bazi_data.get("day_pillar", {}),
                    hour_pillar=bazi_data.get("hour_pillar", {}),
                    day_master=data["day_master"],
                    bazi_string=data["bazi_string"],
                    primary_element=data.get("primary_element"),
                    personality_summary=data.get("personality_summary"),
                    created_at=data["created_at"],
                    updated_at=data["updated_at"]
                ),
                greeting_message=data.get("greeting_message"),
                personality_traits=data.get("personality_traits", []),
                tags=data.get("tags", []),
                interaction_count=data.get("interaction_count", 0),
                favorite_count=data.get("favorite_count", 0),
                visibility_status=data["visibility_status"],
                deep_dialogue_unlocked=data.get("deep_dialogue_unlocked", False),
                avatar_url=data.get("avatar_url"),
                created_at=data["created_at"],
                updated_at=data["updated_at"]
            )
            characters.append(char)
        
        return CharacterListResponse(
            characters=characters,
            total=total,
            page=page,
            page_size=page_size
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching characters: {str(e)}"
        )


@router.get("/public", response_model=CharacterListResponse)
async def get_public_characters(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    """Get all public characters (Character Gallery)"""
    supabase = get_supabase()
    
    try:
        # Get total count
        count_result = supabase.table("characters").select("id", count="exact").in_("visibility_status", ["public", "synced"]).execute()
        total = count_result.count if count_result.count else 0
        
        # Get paginated data
        offset = (page - 1) * page_size
        result = supabase.table("characters").select("*").in_("visibility_status", ["public", "synced"]).range(offset, offset + page_size - 1).execute()
        
        characters = []
        for data in result.data:
            bazi_data = data.get("bazi_data", {})
            
            char = CharacterResponse(
                id=data["id"],
                creator_id=data["creator_id"],
                character_name=data["character_name"],
                creation_mode=data["creation_mode"],
                description=data.get("description"),
                bazi_profile=BaZiProfileResponse(
                    id=data["id"],
                    user_id=data["creator_id"],
                    birth_year=data["bazi_year"],
                    birth_month=data["bazi_month"],
                    birth_day=data["bazi_day"],
                    birth_hour=data["bazi_hour"],
                    birth_minute=data["bazi_minute"],
                    gender=data["gender"],
                    year_pillar=bazi_data.get("year_pillar", {}),
                    month_pillar=bazi_data.get("month_pillar", {}),
                    day_pillar=bazi_data.get("day_pillar", {}),
                    hour_pillar=bazi_data.get("hour_pillar", {}),
                    day_master=data["day_master"],
                    bazi_string=data["bazi_string"],
                    primary_element=data.get("primary_element"),
                    personality_summary=data.get("personality_summary"),
                    created_at=data["created_at"],
                    updated_at=data["updated_at"]
                ),
                greeting_message=data.get("greeting_message"),
                personality_traits=data.get("personality_traits", []),
                tags=data.get("tags", []),
                interaction_count=data.get("interaction_count", 0),
                favorite_count=data.get("favorite_count", 0),
                visibility_status=data["visibility_status"],
                deep_dialogue_unlocked=False,  # Public access doesn't get deep dialogue
                avatar_url=data.get("avatar_url"),
                created_at=data["created_at"],
                updated_at=data["updated_at"]
            )
            characters.append(char)
        
        return CharacterListResponse(
            characters=characters,
            total=total,
            page=page,
            page_size=page_size
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching public characters: {str(e)}"
        )


@router.get("/{character_id}", response_model=CharacterResponse)
async def get_character(character_id: str):
    """Get character details by ID"""
    supabase = get_supabase()
    
    try:
        result = supabase.table("characters").select("*").eq("id", character_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Character not found"
            )
        
        data = result.data[0]
        bazi_data = data.get("bazi_data", {})
        
        return CharacterResponse(
            id=data["id"],
            creator_id=data["creator_id"],
            character_name=data["character_name"],
            creation_mode=data["creation_mode"],
            description=data.get("description"),
            bazi_profile=BaZiProfileResponse(
                id=data["id"],
                user_id=data["creator_id"],
                birth_year=data["bazi_year"],
                birth_month=data["bazi_month"],
                birth_day=data["bazi_day"],
                birth_hour=data["bazi_hour"],
                birth_minute=data["bazi_minute"],
                gender=data["gender"],
                year_pillar=bazi_data.get("year_pillar", {}),
                month_pillar=bazi_data.get("month_pillar", {}),
                day_pillar=bazi_data.get("day_pillar", {}),
                hour_pillar=bazi_data.get("hour_pillar", {}),
                day_master=data["day_master"],
                bazi_string=data["bazi_string"],
                primary_element=data.get("primary_element"),
                personality_summary=data.get("personality_summary"),
                created_at=data["created_at"],
                updated_at=data["updated_at"]
            ),
            greeting_message=data.get("greeting_message"),
            personality_traits=data.get("personality_traits", []),
            tags=data.get("tags", []),
            interaction_count=data.get("interaction_count", 0),
            favorite_count=data.get("favorite_count", 0),
            visibility_status=data["visibility_status"],
            deep_dialogue_unlocked=data.get("deep_dialogue_unlocked", False),
            avatar_url=data.get("avatar_url"),
            created_at=data["created_at"],
            updated_at=data["updated_at"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching character: {str(e)}"
        )


@router.delete("/{character_id}")
async def delete_character(
    character_id: str,
    authorization: str = Header(None)
):
    """Delete a character (only by creator)"""
    user_id = get_user_from_token(authorization)
    supabase = get_supabase()
    
    try:
        # Verify ownership
        result = supabase.table("characters").select("creator_id").eq("id", character_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Character not found"
            )
        
        if result.data[0]["creator_id"] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete this character"
            )
        
        # Delete character
        supabase.table("characters").delete().eq("id", character_id).execute()
        
        return {"message": "Character deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting character: {str(e)}"
        )

