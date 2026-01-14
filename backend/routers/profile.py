from fastapi import APIRouter, HTTPException, status, Header
from typing import Optional
from models.schemas import BaZiProfileCreate, BaZiProfileResponse
from database import get_supabase
from utils.bazi_calculator import calculate_bazi_profile
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


@router.post("/bazi", response_model=BaZiProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_bazi_profile(
    profile_data: BaZiProfileCreate,
    authorization: str = Header(None)
):
    """Create user's BaZi profile"""
    user_id = get_user_from_token(authorization)
    supabase = get_supabase()
    
    try:
        # Check if profile already exists
        existing = supabase.table("bazi_profiles").select("*").eq("user_id", user_id).execute()
        if existing.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="BaZi profile already exists. Use update endpoint."
            )
        
        # Calculate BaZi
        bazi_data = calculate_bazi_profile(
            birth_year=profile_data.birth_year,
            birth_month=profile_data.birth_month,
            birth_day=profile_data.birth_day,
            birth_hour=profile_data.birth_hour,
            birth_minute=profile_data.birth_minute,
            gender=profile_data.gender.value,
            use_true_solar_time=profile_data.use_true_solar_time
        )
        
        # Prepare database record
        profile_id = str(uuid.uuid4())
        db_data = {
            "id": profile_id,
            "user_id": user_id,
            "birth_year": profile_data.birth_year,
            "birth_month": profile_data.birth_month,
            "birth_day": profile_data.birth_day,
            "birth_hour": profile_data.birth_hour,
            "birth_minute": profile_data.birth_minute,
            "gender": profile_data.gender.value,
            "birth_location": profile_data.birth_location,
            "longitude": profile_data.longitude,
            "latitude": profile_data.latitude,
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
            "bazi_data": bazi_data,  # Store complete data as JSONB
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        # Insert into database
        result = supabase.table("bazi_profiles").insert(db_data).execute()
        
        # Format response
        return BaZiProfileResponse(
            id=profile_id,
            user_id=user_id,
            birth_year=profile_data.birth_year,
            birth_month=profile_data.birth_month,
            birth_day=profile_data.birth_day,
            birth_hour=profile_data.birth_hour,
            birth_minute=profile_data.birth_minute,
            gender=profile_data.gender,
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
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating BaZi profile: {str(e)}"
        )


@router.get("/bazi/me", response_model=BaZiProfileResponse)
async def get_my_bazi_profile(authorization: str = Header(None)):
    """Get current user's BaZi profile"""
    user_id = get_user_from_token(authorization)
    supabase = get_supabase()
    
    try:
        result = supabase.table("bazi_profiles").select("*").eq("user_id", user_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="BaZi profile not found"
            )
        
        data = result.data[0]
        bazi_data = data.get("bazi_data", {})
        
        return BaZiProfileResponse(
            id=data["id"],
            user_id=data["user_id"],
            birth_year=data["birth_year"],
            birth_month=data["birth_month"],
            birth_day=data["birth_day"],
            birth_hour=data["birth_hour"],
            birth_minute=data["birth_minute"],
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
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching BaZi profile: {str(e)}"
        )


@router.delete("/bazi/me")
async def delete_my_bazi_profile(authorization: str = Header(None)):
    """Delete current user's BaZi profile"""
    user_id = get_user_from_token(authorization)
    supabase = get_supabase()
    
    try:
        result = supabase.table("bazi_profiles").delete().eq("user_id", user_id).execute()
        return {"message": "BaZi profile deleted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting BaZi profile: {str(e)}"
        )

