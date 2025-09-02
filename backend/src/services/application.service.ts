import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { NotFoundError } from '../types/errors';

type Tables = Database['public']['Tables'];
type Application = Tables['applications']['Row'];
type UserAppSubscription = Tables['user_app_subscriptions']['Row'];
type SubscriptionLevel = Database['public']['Enums']['subscription_level'];

const USER_APP_SUBSCRIPTIONS = 'user_app_subscriptions' as const;
const APPLICATIONS = 'applications' as const;

export class ApplicationService {
  async getAllApplications(): Promise<Application[]> {
    const { data, error } = await supabase
      .from(APPLICATIONS)
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  async getApplication(id: string): Promise<Application> {
    const { data, error } = await supabase
      .from(APPLICATIONS)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) throw new NotFoundError('Application');
    return data;
  }

  async getUserSubscriptions(userId: string): Promise<UserAppSubscription[]> {
    const { data, error } = await supabase
      .from(USER_APP_SUBSCRIPTIONS)
      .select('*, applications(id, name, description)')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  }

  async getUserApplicationLevel(userId: string, applicationId: string): Promise<SubscriptionLevel> {
    const { data, error } = await supabase
      .from(USER_APP_SUBSCRIPTIONS)
      .select('subscription_level')
      .eq('user_id', userId)
      .eq('application_id', applicationId)
      .single();
    
    if (error || !data) return 'free';
    return data.subscription_level as SubscriptionLevel;
  }

  async updateUserSubscription(
    userId: string,
    applicationId: string,
    level: SubscriptionLevel,
    validUntil?: string
  ): Promise<UserAppSubscription> {
    const { data, error } = await supabase
      .from(USER_APP_SUBSCRIPTIONS)
      .upsert({
        user_id: userId,
        application_id: applicationId,
        subscription_level: level,
        valid_until: validUntil
      } as Tables['user_app_subscriptions']['Insert'])
      .select()
      .single();
    
    if (error || !data) throw error;
    return data;
  }

  async checkSubscriptionAccess(
    userId: string,
    applicationId: string,
    requiredLevel: SubscriptionLevel
  ): Promise<boolean> {
    const levels: SubscriptionLevel[] = ['free', 'intro', 'minimum', 'full'];
    const userLevel = await this.getUserApplicationLevel(userId, applicationId);
    
    const userLevelIndex = levels.indexOf(userLevel);
    const requiredLevelIndex = levels.indexOf(requiredLevel);
    
    return userLevelIndex >= requiredLevelIndex;
  }
}

export const applicationService = new ApplicationService();