# XwanAI Frontend

Next.js 14 frontend for XwanAI - AI Character Creation & Interaction Platform

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8000/api)

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                      # Next.js 14 App Router
│   ├── auth/                 # Authentication pages
│   │   ├── login/           # Login page
│   │   └── register/        # Registration page
│   ├── profile/             # User profile pages
│   │   └── bazi-create/     # BaZi profile creation
│   ├── dashboard/           # Main dashboard
│   ├── characters/          # Public character gallery
│   ├── my-characters/       # User's character management
│   ├── character/
│   │   ├── create/          # Character creation
│   │   └── [id]/            # Character detail page
│   ├── chat/
│   │   └── [characterId]/   # Chat interface
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   └── Navbar.tsx          # Navigation bar
├── lib/                     # Utilities
│   ├── api.ts              # API client
│   └── supabase.ts         # Supabase client
├── store/                   # State management
│   └── authStore.ts        # Auth state (Zustand)
└── public/                  # Static assets
```

## Features

### Implemented
✅ User authentication (register/login)
✅ BaZi profile creation
✅ Character creation (Mode 1 & 2)
✅ Character gallery (public characters)
✅ My characters management
✅ Real-time chat with characters
✅ Character detail pages
✅ Responsive design
✅ Modern UI with Tailwind CSS

### TODO (Future Enhancements)
- [ ] Mode 3 & 4 character creation
- [ ] Synastry analysis
- [ ] Character editing
- [ ] Social features (favorites, sharing)
- [ ] Avatar upload
- [ ] Advanced search/filtering
- [ ] Multi-language support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Auth**: Supabase Auth
- **Icons**: Lucide React
- **Forms**: React Hook Form

## Key Pages

### Landing Page (`/`)
- Hero section with CTA
- Feature highlights
- Navigation to login/register

### Authentication
- `/auth/login` - User login
- `/auth/register` - User registration

### Dashboard (`/dashboard`)
- Welcome message
- BaZi profile status
- Quick action cards
- Feature introduction

### Profile
- `/profile/bazi-create` - Create BaZi profile

### Characters
- `/characters` - Browse public characters
- `/my-characters` - Manage user's characters
- `/character/create` - Create new character
- `/character/[id]` - Character detail page

### Chat
- `/chat/[characterId]` - Chat interface with character

## Development Notes

### State Management
- Uses Zustand for global state (auth)
- Local state for component-specific data
- API calls wrapped in try-catch with error handling

### API Integration
- All API calls centralized in `lib/api.ts`
- Automatic token injection via axios interceptor
- Proper error handling and user feedback

### Styling
- Tailwind CSS for utility-first styling
- Custom color palette (purple/pink gradients)
- Dark theme throughout
- Responsive design for mobile/tablet/desktop

### Authentication Flow
1. User registers/logs in
2. Token stored in localStorage
3. Token attached to all API requests
4. Auth state managed by Zustand store

## Deployment

The frontend can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- Any platform supporting Node.js

### Environment Variables for Production
Set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL`

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

Proprietary - All rights reserved

