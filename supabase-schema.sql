-- Vestro Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hustles table
CREATE TABLE IF NOT EXISTS public.hustles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'freelance',
  is_passive BOOLEAN DEFAULT FALSE,
  start_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table (income/expenses)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hustle_id UUID REFERENCES public.hustles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(12, 2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL,
  description TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time logs table
CREATE TABLE IF NOT EXISTS public.time_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hustle_id UUID REFERENCES public.hustles(id) ON DELETE CASCADE NOT NULL,
  hours DECIMAL(5, 2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) DEFAULT 0,
  achieved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_hustles_user_id ON public.hustles(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_hustle_id ON public.transactions(hustle_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
CREATE INDEX IF NOT EXISTS idx_time_logs_hustle_id ON public.time_logs(hustle_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hustles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own hustles" ON public.hustles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hustles" ON public.hustles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own hustles" ON public.hustles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own hustles" ON public.hustles
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.hustles 
      WHERE hustles.id = transactions.hustle_id 
      AND hustles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own transactions" ON public.transactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.hustles 
      WHERE hustles.id = transactions.hustle_id 
      AND hustles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own transactions" ON public.transactions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.hustles 
      WHERE hustles.id = transactions.hustle_id 
      AND hustles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own transactions" ON public.transactions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.hustles 
      WHERE hustles.id = transactions.hustle_id 
      AND hustles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own time logs" ON public.time_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.hustles 
      WHERE hustles.id = time_logs.hustle_id 
      AND hustles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own time logs" ON public.time_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.hustles 
      WHERE hustles.id = time_logs.hustle_id 
      AND hustles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own time logs" ON public.time_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.hustles 
      WHERE hustles.id = time_logs.hustle_id 
      AND hustles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own time logs" ON public.time_logs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.hustles 
      WHERE hustles.id = time_logs.hustle_id 
      AND hustles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own goals" ON public.goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON public.goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON public.goals
  FOR DELETE USING (auth.uid() = user_id);

-- Function to create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hustles_updated_at BEFORE UPDATE ON public.hustles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
