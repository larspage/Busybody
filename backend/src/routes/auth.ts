import { Router } from 'express';
import { z } from 'zod';
import { ValidationError } from '../types/errors';
import { userSchema, loginSchema } from '../types/user';
import { supabase } from '../lib/supabase';

export const authRouter = Router();

// Register new user
authRouter.post('/register', async (req, res, next) => {
  try {
    const userData = userSchema.parse(req.body);
    
    const { data: { user, session }, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name
        }
      }
    });

    if (error) throw error;

    res.status(201).json({
      user,
      token: session?.access_token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ValidationError('Invalid user data', error));
    } else {
      next(error);
    }
  }
});

// Login user
authRouter.post('/login', async (req, res, next) => {
  try {
    const loginData = loginSchema.parse(req.body);
    
    const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password
    });

    if (error) throw error;
    if (!session) throw new ValidationError('Invalid credentials');

    res.json({
      user,
      token: session.access_token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ValidationError('Invalid login data', error));
    } else {
      next(error);
    }
  }
});

// Logout
authRouter.post('/logout', async (req, res, next) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});