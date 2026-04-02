-- Migration: Create personalized_plans table
-- Description: Stores user's personalized career plans, test results, and selected formations.

CREATE TABLE IF NOT EXISTS public.personalized_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    riasec_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
    test_score INTEGER DEFAULT 0,
    recommended_metiers JSONB DEFAULT '[]'::jsonb,
    selected_metiers JSONB DEFAULT '[]'::jsonb,
    selected_formations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT personalized_plans_user_id_key UNIQUE (user_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_personalized_plans_user_id ON public.personalized_plans(user_id);

-- Setup Row Level Security (RLS)
ALTER TABLE public.personalized_plans ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view their own plan" 
    ON public.personalized_plans FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plan" 
    ON public.personalized_plans FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plan" 
    ON public.personalized_plans FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plan" 
    ON public.personalized_plans FOR DELETE 
    USING (auth.uid() = user_id);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_personalized_plans_modtime
    BEFORE UPDATE ON public.personalized_plans
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();