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
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      hustles: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string
          is_passive: boolean
          start_date: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category?: string
          is_passive?: boolean
          start_date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string
          is_passive?: boolean
          start_date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          hustle_id: string
          type: 'income' | 'expense'
          amount: number
          date: string
          category: string
          description: string | null
          receipt_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          hustle_id: string
          type: 'income' | 'expense'
          amount: number
          date?: string
          category: string
          description?: string | null
          receipt_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          hustle_id?: string
          type?: 'income' | 'expense'
          amount?: number
          date?: string
          category?: string
          description?: string | null
          receipt_url?: string | null
          created_at?: string
        }
      }
      time_logs: {
        Row: {
          id: string
          hustle_id: string
          hours: number
          date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          hustle_id: string
          hours: number
          date?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          hustle_id?: string
          hours?: number
          date?: string
          notes?: string | null
          created_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          name: string
          target_amount: number
          current_amount: number
          achieved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          target_amount: number
          current_amount?: number
          achieved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          target_amount?: number
          current_amount?: number
          achieved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
