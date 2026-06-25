export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ads: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          placement: string
          priority: number | null
          redirect_url: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          placement?: string
          priority?: number | null
          redirect_url?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          placement?: string
          priority?: number | null
          redirect_url?: string | null
          title?: string | null
        }
        Relationships: []
      }
      community_qa: {
        Row: {
          answer: string | null
          answered_at: string | null
          answered_by: string | null
          created_at: string | null
          id: string
          is_answered: boolean | null
          question: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answer?: string | null
          answered_at?: string | null
          answered_by?: string | null
          created_at?: string | null
          id?: string
          is_answered?: boolean | null
          question: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answer?: string | null
          answered_at?: string | null
          answered_by?: string | null
          created_at?: string | null
          id?: string
          is_answered?: boolean | null
          question?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_qa_answered_by_fkey"
            columns: ["answered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_qa_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      donation_expenses: {
        Row: {
          added_by: string | null
          amount: number
          created_at: string | null
          event_id: string | null
          id: string
          note: string | null
          title: string
        }
        Insert: {
          added_by?: string | null
          amount: number
          created_at?: string | null
          event_id?: string | null
          id?: string
          note?: string | null
          title: string
        }
        Update: {
          added_by?: string | null
          amount?: number
          created_at?: string | null
          event_id?: string | null
          id?: string
          note?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "donation_expenses_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_expenses_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_requests"
            referencedColumns: ["id"]
          }
        ]
      }
      donations: {
        Row: {
          amount: number
          anonymous: boolean | null
          donated_at: string | null
          donor_id: string | null
          event_id: string | null
          id: string
          payment_method: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          anonymous?: boolean | null
          donated_at?: string | null
          donor_id?: string | null
          event_id?: string | null
          id?: string
          payment_method?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          anonymous?: boolean | null
          donated_at?: string | null
          donor_id?: string | null
          event_id?: string | null
          id?: string
          payment_method?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_requests"
            referencedColumns: ["id"]
          }
        ]
      }
      event_categories: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      event_comments: {
        Row: {
          comment: string
          created_at: string | null
          event_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_comments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      event_reactions: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          reaction_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          reaction_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          reaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_reactions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      event_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          donation_enabled: boolean | null
          donation_target: number | null
          end_time: string
          expected_attendance: number | null
          id: string
          location_note: string | null
          rejection_reason: string | null
          requested_date: string
          start_time: string
          status: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          donation_enabled?: boolean | null
          donation_target?: number | null
          end_time: string
          expected_attendance?: number | null
          id?: string
          location_note?: string | null
          rejection_reason?: string | null
          requested_date: string
          start_time: string
          status?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          donation_enabled?: boolean | null
          donation_target?: number | null
          end_time?: string
          expected_attendance?: number | null
          id?: string
          location_note?: string | null
          rejection_reason?: string | null
          requested_date?: string
          start_time?: string
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      event_reschedules: {
        Row: {
          changed_by: string | null
          created_at: string | null
          event_id: string | null
          id: string
          new_date: string | null
          new_start_time: string | null
          old_date: string | null
          old_start_time: string | null
          reason: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          new_date?: string | null
          new_start_time?: string | null
          old_date?: string | null
          old_start_time?: string | null
          reason?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          new_date?: string | null
          new_start_time?: string | null
          old_date?: string | null
          old_start_time?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_reschedules_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_reschedules_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_requests"
            referencedColumns: ["id"]
          }
        ]
      }
      joins: {
        Row: {
          address: string
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      last_ten_days_hadith: {
        Row: {
          arabic_text: string
          bangla_translation: string
          created_at: string
          english_translation: string | null
          id: string
          is_active: boolean | null
          ramadan_day: number
          source: string
        }
        Insert: {
          arabic_text: string
          bangla_translation: string
          created_at?: string
          english_translation?: string | null
          id?: string
          is_active?: boolean | null
          ramadan_day: number
          source: string
        }
        Update: {
          arabic_text?: string
          bangla_translation?: string
          created_at?: string
          english_translation?: string | null
          id?: string
          is_active?: boolean | null
          ramadan_day?: number
          source?: string
        }
        Relationships: []
      }
      mosque_announcements: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          priority: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "mosque_announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      notices: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          message: string | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          message?: string | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          message?: string | null
          title?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          related_event_id: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          related_event_id?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          related_event_id?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "event_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          address: string
          book_title: string
          created_at: string
          id: string
          name: string
          order_type: string
          phone: string
          quantity: number
          total_price: number
          updated_at: string
        }
        Insert: {
          address: string
          book_title: string
          created_at?: string
          id?: string
          name: string
          order_type?: string
          phone: string
          quantity?: number
          total_price: number
          updated_at?: string
        }
        Update: {
          address?: string
          book_title?: string
          created_at?: string
          id?: string
          name?: string
          order_type?: string
          phone?: string
          quantity?: number
          total_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          is_verified: boolean | null
          phone: string | null
          photo_url: string | null
          role: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name: string
          id: string
          is_verified?: boolean | null
          phone?: string | null
          photo_url?: string | null
          role?: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          photo_url?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
