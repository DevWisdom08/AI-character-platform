# XwanAI Backend API

FastAPI backend for XwanAI - AI Character Creation & Interaction Platform

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key
- `OPENAI_API_KEY`: Your OpenAI API key

### 3. Initialize Database

Run the SQL schema in your Supabase SQL Editor:

```bash
# Copy contents of sql/init_schema.sql and run in Supabase dashboard
```

### 4. Run the Server

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Profile (BaZi)
- `POST /api/profile/bazi` - Create user's BaZi profile
- `GET /api/profile/bazi/me` - Get user's BaZi profile
- `DELETE /api/profile/bazi/me` - Delete user's BaZi profile

### Characters
- `POST /api/character/create` - Create new character
- `GET /api/character/my-characters` - Get user's characters
- `GET /api/character/public` - Get public characters (gallery)
- `GET /api/character/{character_id}` - Get character details
- `DELETE /api/character/{character_id}` - Delete character

### Chat
- `POST /api/chat/send` - Send message to character
- `GET /api/chat/conversation/{character_id}` - Get conversation history
- `GET /api/chat/my-conversations` - Get all user conversations

## Project Structure

```
backend/
├── main.py              # FastAPI application entry
├── config.py            # Application configuration
├── database.py          # Supabase client initialization
├── models/
│   └── schemas.py       # Pydantic models
├── routers/
│   ├── auth.py          # Authentication endpoints
│   ├── profile.py       # BaZi profile endpoints
│   ├── character.py     # Character management endpoints
│   └── chat.py          # Chat/conversation endpoints
├── utils/
│   ├── bazi_calculator.py  # BaZi calculation logic
│   └── ai_service.py       # OpenAI integration
└── sql/
    └── init_schema.sql  # Database schema
```

## Development Notes

### BaZi Calculator
The current implementation is a **simplified mock version** for MVP demonstration. For production:
- Integrate `lunar-python` library for accurate calendar calculations
- Implement true solar time adjustments
- Add more sophisticated Ten Gods calculations

### AI Service
Currently uses OpenAI GPT-3.5-turbo. Can be extended to:
- Use GPT-4 for better responses
- Integrate Google Gemini as alternative
- Implement response caching

### Security
- All routes (except public character gallery) require authentication
- JWT tokens are handled by Supabase Auth
- Row Level Security (RLS) policies enforce data access

## Testing

```bash
# Install pytest
pip install pytest httpx

# Run tests (TODO: Add test files)
pytest
```

## Deployment

The backend can be deployed to:
- Railway (recommended)
- Render
- AWS/GCP
- Any platform supporting Python/FastAPI

Environment variables must be set in the deployment platform.

