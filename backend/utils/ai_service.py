"""
AI Service for character interactions using OpenAI
"""

from openai import OpenAI
from config import settings
from typing import Dict, List, Optional
import json

client = OpenAI(api_key=settings.OPENAI_API_KEY)


class AIService:
    """AI Service for generating character responses"""
    
    @staticmethod
    def generate_character_greeting(
        character_name: str,
        personality_summary: str,
        bazi_string: str
    ) -> str:
        """Generate a greeting message for a character"""
        
        prompt = f"""You are {character_name}, a character with the following traits:
Personality: {personality_summary}
BaZi (命理): {bazi_string}

Generate a warm, character-appropriate greeting message (in Chinese, max 100 characters) that reflects your personality.
Do not include any explanation, just the greeting itself."""

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful character creator assistant."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150,
                temperature=0.8
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"你好，我是{character_name}，很高兴认识你！"
    
    @staticmethod
    def generate_chat_response(
        user_message: str,
        character_name: str,
        character_personality: str,
        bazi_data: Dict,
        conversation_history: List[Dict] = None
    ) -> str:
        """Generate AI response based on character's personality and BaZi"""
        
        if conversation_history is None:
            conversation_history = []
        
        system_prompt = f"""你是{character_name}。你的性格特征：{character_personality}

你的命理特征：
- 八字：{bazi_data.get('bazi_string', '')}
- 日主：{bazi_data.get('day_master', '')}
- 主要元素：{bazi_data.get('primary_element', '')}

请以这个角色的身份回复用户。保持性格一致，回复自然流畅（中文），不要过于生硬或说教。"""

        messages = [
            {"role": "system", "content": system_prompt}
        ]
        
        # Add conversation history
        for msg in conversation_history[-10:]:  # Last 10 messages
            messages.append({"role": "user", "content": msg.get("user", "")})
            messages.append({"role": "assistant", "content": msg.get("assistant", "")})
        
        # Add current message
        messages.append({"role": "user", "content": user_message})
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=500,
                temperature=0.9
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"AI Service Error: {str(e)}")
            return "抱歉，我现在有些困惑，能再说一遍吗？"
    
    @staticmethod
    def analyze_bazi_compatibility(
        user_bazi: Dict,
        character_bazi: Dict
    ) -> Dict:
        """Analyze compatibility between user and character (Synastry)"""
        
        prompt = f"""作为命理分析专家，分析以下两个八字的相性：

用户八字：{user_bazi.get('bazi_string', '')}
角色八字：{character_bazi.get('bazi_string', '')}

请从以下维度简要分析（每项2-3句话）：
1. 五行相生相克
2. 性格契合度
3. 互动建议

以JSON格式返回，包含 compatibility_score (0-100), elements_analysis, personality_match, advice 字段。"""

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional BaZi analyst."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.7
            )
            
            content = response.choices[0].message.content.strip()
            # Try to parse JSON, fallback to structured response
            try:
                return json.loads(content)
            except:
                return {
                    "compatibility_score": 75,
                    "elements_analysis": content,
                    "personality_match": "中等契合",
                    "advice": "保持真诚沟通"
                }
        except Exception as e:
            print(f"AI Service Error: {str(e)}")
            return {
                "compatibility_score": 70,
                "elements_analysis": "分析暂时不可用",
                "personality_match": "待分析",
                "advice": "多多交流以增进了解"
            }

