import { User } from '../types/user';
import { NotFoundError } from '../types/errors';
import { supabase } from '../lib/supabase';

export class UserService {
  async getUserById(userId: string): Promise<User> {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new NotFoundError('User');
    }

    return user;
  }
}

// Export a singleton instance
export const userService = new UserService();