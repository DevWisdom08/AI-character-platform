from fastapi import APIRouter, HTTPException, status, Header
from typing import List
from models.schemas import ChatMessageCreate, ChatMessageResponse, ConversationResponse
from database import get_supabase
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


@router.post("/send", response_model=ChatMessageResponse)
async def send_message(
    message_data: ChatMessageCreate,
    authorization: str = Header(None)
):
    """Send a message to a character and get response"""
    user_id = get_user_from_token(authorization)
    supabase = get_supabase()
    
    try:
        # Get character data
        char_result = supabase.table("characters").select("*").eq("id", message_data.character_id).execute()
        
        if not char_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Character not found"
            )
        
        character = char_result.data[0]
        
        # Check access permissions
        is_creator = character["creator_id"] == user_id
        is_deep_dialogue = character.get("deep_dialogue_unlocked", False)
        
        if not is_creator and not is_deep_dialogue:
            # Public character, limited interaction
            if character["visibility_status"] == "private":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="This character is private"
                )
        
        # Get or create conversation
        conv_result = supabase.table("conversations").select("*").eq("character_id", message_data.character_id).eq("user_id", user_id).execute()
        
        if conv_result.data:
            conversation_id = conv_result.data[0]["id"]
        else:
            # Create new conversation
            conversation_id = str(uuid.uuid4())
            supabase.table("conversations").insert({
                "id": conversation_id,
                "character_id": message_data.character_id,
                "user_id": user_id,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }).execute()
        
        # Get conversation history
        history_result = supabase.table("chat_messages").select("*").eq("conversation_id", conversation_id).order("created_at", desc=False).limit(20).execute()
        
        conversation_history = []
        for msg in history_result.data:
            conversation_history.append({
                "user": msg["message"],
                "assistant": msg["response"]
            })
        
        # Generate AI response
        bazi_data = character.get("bazi_data", {})
        ai_response = AIService.generate_chat_response(
            user_message=message_data.message,
            character_name=character["character_name"],
            character_personality=character.get("personality_summary", ""),
            bazi_data=bazi_data,
            conversation_history=conversation_history
        )
        
        # Save message
        message_id = str(uuid.uuid4())
        message_record = {
            "id": message_id,
            "conversation_id": conversation_id,
            "character_id": message_data.character_id,
            "user_id": user_id,
            "message": message_data.message,
            "response": ai_response,
            "created_at": datetime.utcnow().isoformat()
        }
        
        supabase.table("chat_messages").insert(message_record).execute()
        
        # Update interaction count
        current_count = character.get("interaction_count", 0)
        supabase.table("characters").update({
            "interaction_count": current_count + 1
        }).eq("id", message_data.character_id).execute()
        
        # Update conversation timestamp
        supabase.table("conversations").update({
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", conversation_id).execute()
        
        return ChatMessageResponse(
            id=message_id,
            conversation_id=conversation_id,
            character_id=message_data.character_id,
            user_id=user_id,
            message=message_data.message,
            response=ai_response,
            created_at=datetime.utcnow()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error sending message: {str(e)}"
        )


@router.get("/conversation/{character_id}", response_model=ConversationResponse)
async def get_conversation(
    character_id: str,
    authorization: str = Header(None)
):
    """Get conversation history with a character"""
    user_id = get_user_from_token(authorization)
    supabase = get_supabase()
    
    try:
        # Get conversation
        conv_result = supabase.table("conversations").select("*").eq("character_id", character_id).eq("user_id", user_id).execute()
        
        if not conv_result.data:
            # Return empty conversation
            return ConversationResponse(
                id="",
                character_id=character_id,
                user_id=user_id,
                messages=[],
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
        
        conversation = conv_result.data[0]
        
        # Get messages
        messages_result = supabase.table("chat_messages").select("*").eq("conversation_id", conversation["id"]).order("created_at", desc=False).execute()
        
        messages = [
            ChatMessageResponse(
                id=msg["id"],
                conversation_id=msg["conversation_id"],
                character_id=msg["character_id"],
                user_id=msg["user_id"],
                message=msg["message"],
                response=msg["response"],
                created_at=msg["created_at"]
            )
            for msg in messages_result.data
        ]
        
        return ConversationResponse(
            id=conversation["id"],
            character_id=conversation["character_id"],
            user_id=conversation["user_id"],
            messages=messages,
            created_at=conversation["created_at"],
            updated_at=conversation["updated_at"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching conversation: {str(e)}"
        )


@router.get("/my-conversations")
async def get_my_conversations(authorization: str = Header(None)):
    """Get all conversations for current user"""
    user_id = get_user_from_token(authorization)
    supabase = get_supabase()
    
    try:
        result = supabase.table("conversations").select("*, characters(character_name, avatar_url)").eq("user_id", user_id).order("updated_at", desc=True).execute()
        
        return {"conversations": result.data}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching conversations: {str(e)}"
        )

