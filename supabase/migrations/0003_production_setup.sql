-- Migration: 0003_production_setup
-- Description: Creates necessary tables for production launch (notifications, feedback, logs)

-- 1. Notifications Table (if not already strictly defined as requested)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    action_label TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- 2. Notification Preferences Table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT false,
    in_app_notifications BOOLEAN DEFAULT true,
    notify_test_completed BOOLEAN DEFAULT true,
    notify_plan_created BOOLEAN DEFAULT true,
    notify_milestone_completed BOOLEAN DEFAULT true,
    notify_job_offer BOOLEAN DEFAULT true,
    notify_formation_available BOOLEAN DEFAULT true,
    notify_feedback_received BOOLEAN DEFAULT true,
    notification_frequency TEXT DEFAULT 'immediate',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Test Metier Feedback Table
CREATE TABLE IF NOT EXISTS public.test_metier_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    test_id UUID, -- Optional link to specific test session
    metier_code TEXT NOT NULL,
    helpful BOOLEAN,
    accuracy INTEGER CHECK (accuracy >= 1 AND accuracy <= 5),
    chosen BOOLEAN DEFAULT false,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_test_feedback_user_id ON public.test_metier_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_test_feedback_metier_code ON public.test_metier_feedback(metier_code);

-- 4. User Activity Logs
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON public.user_activity_logs(created_at DESC);

-- 5. Security Logs
CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    user_id UUID, -- Optional, if linked to a specific user
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID
);

CREATE INDEX IF NOT EXISTS idx_security_logs_severity ON public.security_logs(severity);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON public.security_logs(created_at DESC);

-- RLS Policies for Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Notification Preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notification preferences" ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Test Feedback
ALTER TABLE public.test_metier_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own test feedback" ON public.test_metier_feedback FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Activity Logs (Insert only for users, Admin read)
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own logs" ON public.user_activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all logs" ON public.user_activity_logs FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

-- RLS Policies for Security Logs (Admin only)
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view security logs" ON public.security_logs FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));