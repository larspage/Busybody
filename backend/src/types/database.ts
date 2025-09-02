export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_app_subscriptions: {
        Row: {
          id: string
          user_id: string
          application_id: string
          subscription_level: 'free' | 'intro' | 'minimum' | 'full'
          valid_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          application_id: string
          subscription_level?: 'free' | 'intro' | 'minimum' | 'full'
          valid_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          application_id?: string
          subscription_level?: 'free' | 'intro' | 'minimum' | 'full'
          valid_until?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          status: 'todo' | 'in_progress' | 'completed'
          priority: 'low' | 'medium' | 'high'
          due_date: string
          tags: string[]
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          status?: 'todo' | 'in_progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          due_date: string
          tags?: string[]
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: 'todo' | 'in_progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          due_date?: string
          tags?: string[]
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      task_status: 'todo' | 'in_progress' | 'completed'
      priority: 'low' | 'medium' | 'high'
      subscription_level: 'free' | 'intro' | 'minimum' | 'full'
    }
  }
}

// Helper types for Supabase
export type DbRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type DbInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type DbUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type DbEnum<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Specific types for tasks
export type TaskRow = DbRow<'tasks'>
export type TaskInsert = DbInsert<'tasks'>
export type TaskUpdate = DbUpdate<'tasks'>
export type TaskStatus = DbEnum<'task_status'>
export type TaskPriority = DbEnum<'priority'>