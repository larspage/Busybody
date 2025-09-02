-- Create enum for subscription levels
CREATE TYPE subscription_level AS ENUM ('free', 'intro', 'minimum', 'full');

-- Create applications table
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create user_app_subscriptions table to track user subscriptions for each app
CREATE TABLE user_app_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  subscription_level subscription_level NOT NULL DEFAULT 'free',
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, application_id)
);

-- Add updated_at trigger for applications
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at trigger for user_app_subscriptions
CREATE TRIGGER update_user_app_subscriptions_updated_at
  BEFORE UPDATE ON user_app_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Set up RLS for applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Applications are viewable by all authenticated users
CREATE POLICY "Applications are viewable by all authenticated users"
  ON applications FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can modify applications
CREATE POLICY "Only admins can modify applications"
  ON applications FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Set up RLS for user_app_subscriptions
ALTER TABLE user_app_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON user_app_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Only admins can modify subscriptions
CREATE POLICY "Only admins can modify subscriptions"
  ON user_app_subscriptions FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create indexes
CREATE INDEX user_app_subscriptions_user_id_idx ON user_app_subscriptions(user_id);
CREATE INDEX user_app_subscriptions_application_id_idx ON user_app_subscriptions(application_id);
CREATE INDEX user_app_subscriptions_level_idx ON user_app_subscriptions(subscription_level);

-- Insert initial applications
INSERT INTO applications (name, description) VALUES
  ('BusyBody', 'Task management and productivity application'),
  ('ThoughtCatcher', 'Note-taking and idea management application'),
  ('RestaurantRoller', 'Restaurant decision-making application');