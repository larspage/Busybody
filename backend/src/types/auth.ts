import { Request } from 'express';
import { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  [key: string]: unknown;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface SupabaseUser extends User {
  id: string;
  email?: string;
  aud: string;
  role: string;
  email_confirmed_at?: string;
}