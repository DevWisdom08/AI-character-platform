from fastapi import APIRouter, HTTPException, status
from models.schemas import UserRegister, UserLogin, Token
from database import get_supabase
from config import settings

router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    """Register a new user"""
    supabase = get_supabase()
    
    try:
        print(f"[AUTH] Attempting to register user: {user_data.email}")
        
        # Check if user already exists
        try:
            existing_check = supabase.auth.sign_in_with_password({
                "email": user_data.email,
                "password": user_data.password
            })
            if existing_check.user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User already registered"
                )
        except:
            pass  # User doesn't exist, continue with registration
        
        # Register user with Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "username": user_data.username
                }
            }
        })
        
        print(f"[AUTH] Supabase signup response - User: {auth_response.user is not None}, Session: {auth_response.session is not None}")
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed - could not create user"
            )
        
        # Create user profile in database
        try:
            profile_data = {
                "id": auth_response.user.id,
                "email": user_data.email,
                "username": user_data.username,
            }
            supabase.table("users").insert(profile_data).execute()
            print(f"[AUTH] User profile created in database")
        except Exception as db_error:
            print(f"[AUTH] Database error: {str(db_error)}")
            # If profile creation fails, user is still created in Auth, so continue
            pass
        
        # Handle session
        if auth_response.session and auth_response.session.access_token:
            print(f"[AUTH] Registration successful with immediate session")
            return Token(
                access_token=auth_response.session.access_token,
                user_id=auth_response.user.id
            )
        else:
            # Email confirmation required - try to sign in
            print(f"[AUTH] No session returned, attempting sign in")
            try:
                signin_response = supabase.auth.sign_in_with_password({
                    "email": user_data.email,
                    "password": user_data.password
                })
                
                if signin_response.session and signin_response.session.access_token:
                    print(f"[AUTH] Sign in successful after registration")
                    return Token(
                        access_token=signin_response.session.access_token,
                        user_id=auth_response.user.id
                    )
            except Exception as signin_error:
                print(f"[AUTH] Sign in failed: {str(signin_error)}")
            
            # If all else fails, return error
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration created but email confirmation required. Please check your email or contact support."
            )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"[AUTH] Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login user"""
    supabase = get_supabase()
    
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        return Token(
            access_token=auth_response.session.access_token,
            user_id=auth_response.user.id
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )


@router.post("/logout")
async def logout():
    """Logout user"""
    supabase = get_supabase()
    
    try:
        supabase.auth.sign_out()
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Logout error: {str(e)}"
        )


@router.get("/me")
async def get_current_user():
    """Get current user info"""
    supabase = get_supabase()
    
    try:
        user = supabase.auth.get_user()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated"
            )
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )

