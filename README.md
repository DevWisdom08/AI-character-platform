# XwanAI - AI Character Creation & Interaction Platform

> **Discover your Ego, Define your Echo**

A sophisticated AI-powered platform that combines Chinese BaZi (八字) astrology with modern AI technology to create deeply personalized character interactions.

## 🌟 Overview

XwanAI is a full-stack application that enables users to:
- Create personalized BaZi profiles for deep self-understanding
- Design AI characters with unique "souls" based on astrological frameworks
- Engage in meaningful, personality-driven conversations with characters
- Share and discover community-created characters

## 🏗️ Architecture

### Tech Stack

**Backend:**
- FastAPI (Python 3.10+)
- Supabase (PostgreSQL + Auth + Storage)
- OpenAI GPT-3.5/4
- Lunar-python (BaZi calculations)

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Axios (HTTP Client)

## 📁 Project Structure

```
XwanAI/
├── backend/                 # FastAPI backend
│   ├── main.py             # Application entry point
│   ├── config.py           # Configuration
│   ├── database.py         # Supabase client
│   ├── models/
│   │   └── schemas.py      # Pydantic models
│   ├── routers/
│   │   ├── auth.py         # Authentication endpoints
│   │   ├── profile.py      # BaZi profile endpoints
│   │   ├── character.py    # Character management
│   │   └── chat.py         # Chat/conversation
│   ├── utils/
│   │   ├── bazi_calculator.py  # BaZi calculations
│   │   └── ai_service.py       # OpenAI integration
│   └── sql/
│       └── init_schema.sql     # Database schema
│
├── frontend/                # Next.js frontend
│   ├── app/                # App Router pages
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Main dashboard
│   │   ├── characters/    # Character gallery
│   │   ├── my-characters/ # User's characters
│   │   ├── character/     # Character details & creation
│   │   ├── chat/          # Chat interface
│   │   └── profile/       # User profile
│   ├── components/        # Reusable components
│   ├── lib/              # API client & utilities
│   └── store/            # State management
│
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- Supabase account
- OpenAI API key

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Initialize database:**
- Go to your Supabase dashboard
- Run the SQL from `sql/init_schema.sql` in the SQL editor

5. **Start the server:**
```bash
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

4. **Start development server:**
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 🔑 Environment Variables

### Backend (.env)
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
SECRET_KEY=your_secret_key_for_jwt
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📊 Database Schema

Key tables:
- `users` - User accounts
- `bazi_profiles` - User BaZi profiles
- `characters` - AI characters
- `conversations` - Chat conversations
- `chat_messages` - Individual messages
- `favorites` - User favorites

See `backend/sql/init_schema.sql` for complete schema.

## 🎯 Core Features

### 1. User Authentication
- Email/password registration
- Secure JWT-based authentication
- Supabase Auth integration

### 2. BaZi Profile System
- Accurate Chinese astrology calculations
- Four Pillars (Year, Month, Day, Hour)
- Ten Gods analysis
- Personality insights

### 3. Character Creation
**Mode 1: Real Person Analysis**
- Based on actual birth data
- Historical/celebrity analysis

**Mode 2: Original Character**
- Guided creation process
- Interactive trait selection

(Mode 3 & 4 coming soon)

### 4. Character Interaction
- Deep, personality-driven conversations
- Context-aware AI responses
- Conversation history
- Multiple visibility modes (Private/Public/Synced)

### 5. Character Gallery
- Browse community characters
- Search and filter
- Interaction statistics

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Profile
- `POST /api/profile/bazi` - Create BaZi profile
- `GET /api/profile/bazi/me` - Get user's profile

### Characters
- `POST /api/character/create` - Create character
- `GET /api/character/my-characters` - Get user's characters
- `GET /api/character/public` - Get public characters
- `GET /api/character/{id}` - Get character details
- `DELETE /api/character/{id}` - Delete character

### Chat
- `POST /api/chat/send` - Send message
- `GET /api/chat/conversation/{character_id}` - Get conversation
- `GET /api/chat/my-conversations` - Get all conversations

## 🎨 UI Features

- Modern, responsive design
- Dark theme throughout
- Gradient accents (purple/pink)
- Smooth animations
- Mobile-friendly
- Intuitive navigation

## 📈 MVP Status

### ✅ Completed
- User authentication system
- BaZi profile creation
- Character creation (Mode 1 & 2)
- Character management
- Public character gallery
- Real-time chat interface
- Character detail pages
- Responsive frontend

### 🚧 TODO (Future Enhancements)
- Mode 3 & 4 character creation
- Synastry analysis (compatibility)
- Character editing
- Avatar upload
- Social features (likes, shares)
- Advanced search/filtering
- Admin panel
- Analytics dashboard

## 🔐 Security Features

- JWT token authentication
- Row Level Security (RLS) in Supabase
- Password hashing
- CORS protection
- Input validation
- SQL injection prevention

## 🧪 Testing

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend
Recommended platforms:
- Railway
- Render
- AWS/GCP
- Heroku

### Frontend
Recommended platforms:
- Vercel (best for Next.js)
- Netlify
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- Chinese BaZi astrology principles
- OpenAI for GPT API
- Supabase for backend infrastructure
- Next.js team for the amazing framework

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ for the XwanAI community**

