import { Response, NextFunction } from 'express';
import { UnauthorizedError } from '../types/errors';
import { AuthRequest } from '../types/auth';
import { supabase } from '../lib/supabase';

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return next(new UnauthorizedError('No token provided'));
    }

    // Verify the JWT token using Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return next(new UnauthorizedError('Invalid token'));
    }

    // Add the user to the request
    req.user = {
      id: user.id,
      email: user.email || '',
    };

    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid token'));
  }
};