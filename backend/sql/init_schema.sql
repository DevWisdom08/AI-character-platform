-- XwanAI Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BaZi Profiles table
CREATE TABLE IF NOT EXISTS public.bazi_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Birth Information
    birth_year INTEGER NOT NULL,
    birth_month INTEGER NOT NULL,
    birth_day INTEGER NOT NULL,
    birth_hour INTEGER NOT NULL,
    birth_minute INTEGER NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    birth_location TEXT,
    longitude DECIMAL(10, 7),
    latitude DECIMAL(10, 7),
    
    -- BaZi Data (Four Pillars)
    year_stem TEXT NOT NULL,
    year_branch TEXT NOT NULL,
    month_stem TEXT NOT NULL,
    month_branch TEXT NOT NULL,
    day_stem TEXT NOT NULL,
    day_branch TEXT NOT NULL,
    hour_stem TEXT NOT NULL,
    hour_branch TEXT NOT NULL,
    
    -- Calculated Fields
    day_master TEXT NOT NULL,
    bazi_string TEXT NOT NULL,
    primary_element TEXT,
    personality_summary TEXT,
    
    -- Full BaZi data as JSONB
    bazi_data JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Characters table
CREATE TABLE IF NOT EXISTS public.characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Basic Information
    character_name TEXT NOT NULL,
    creation_mode TEXT NOT NULL CHECK (creation_mode IN ('real_person', 'original', 'concept', 'virtual_ip')),
    description TEXT,
    greeting_message TEXT,
    
    -- BaZi Information
    bazi_year INTEGER NOT NULL,
    bazi_month INTEGER NOT NULL,
    bazi_day INTEGER NOT NULL,
    bazi_hour INTEGER NOT NULL,
    bazi_minute INTEGER NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    
    -- BaZi Data (Four Pillars)
    year_stem TEXT NOT NULL,
    year_branch TEXT NOT NULL,
    month_stem TEXT NOT NULL,
    month_branch TEXT NOT NULL,
    day_stem TEXT NOT NULL,
    day_branch TEXT NOT NULL,
    hour_stem TEXT NOT NULL,
    hour_branch TEXT NOT NULL,
    
    -- Calculated Fields
    day_master TEXT NOT NULL,
    bazi_string TEXT NOT NULL,
    primary_element TEXT,
    personality_summary TEXT,
    
    -- Full BaZi data as JSONB
    bazi_data JSONB,
    
    -- Character Traits
    personality_traits TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    
    -- Visibility & Access
    visibility_status TEXT NOT NULL CHECK (visibility_status IN ('private', 'public', 'synced')) DEFAULT 'private',
    deep_dialogue_unlocked BOOLEAN DEFAULT FALSE,
    
    -- Stats
    interaction_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    
    -- Media
    avatar_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID REFERENCES public.characters(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(character_id, user_id)
);

-- Chat Messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    character_id UUID REFERENCES public.characters(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites table (for users to favorite characters)
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    character_id UUID REFERENCES public.characters(id) ON DELETE CASCADE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, character_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_characters_creator ON public.characters(creator_id);
CREATE INDEX IF NOT EXISTS idx_characters_visibility ON public.characters(visibility_status);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_character ON public.conversations(character_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON public.chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bazi_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- BaZi profiles policies
CREATE POLICY "Users can view their own bazi profile"
    ON public.bazi_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bazi profile"
    ON public.bazi_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bazi profile"
    ON public.bazi_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bazi profile"
    ON public.bazi_profiles FOR DELETE
    USING (auth.uid() = user_id);

-- Characters policies
CREATE POLICY "Anyone can view public characters"
    ON public.characters FOR SELECT
    USING (visibility_status IN ('public', 'synced') OR auth.uid() = creator_id);

CREATE POLICY "Users can create characters"
    ON public.characters FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own characters"
    ON public.characters FOR UPDATE
    USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own characters"
    ON public.characters FOR DELETE
    USING (auth.uid() = creator_id);

-- Conversations policies
CREATE POLICY "Users can view their own conversations"
    ON public.conversations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create conversations"
    ON public.conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can view their own messages"
    ON public.chat_messages FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create messages"
    ON public.chat_messages FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
    ON public.favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
    ON public.favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
    ON public.favorites FOR DELETE
    USING (auth.uid() = user_id);

-- Functions for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bazi_profiles_updated_at BEFORE UPDATE ON public.bazi_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON public.characters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

