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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          title: string
          type: Database["public"]["Enums"]["achievement_type"]
          unlock_criteria: Json
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          title: string
          type: Database["public"]["Enums"]["achievement_type"]
          unlock_criteria: Json
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          title?: string
          type?: Database["public"]["Enums"]["achievement_type"]
          unlock_criteria?: Json
        }
        Relationships: []
      }
      notifications: {
        Row: {
          course_id: string | null
          created_at: string
          description: string
          id: string
          read: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          description: string
          id?: string
          read?: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          description?: string
          id?: string
          read?: boolean
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      otp: {
        Row: {
          code: string
          delete_at: string
          email: string
        }
        Insert: {
          code: string
          delete_at?: string
          email: string
        }
        Update: {
          code?: string
          delete_at?: string
          email?: string
        }
        Relationships: []
      }
      themes: {
        Row: {
          created_at: string
          data_theme: string
          id: string
          title: string
          type: Database["public"]["Enums"]["theme_type"]
          unlock_criteria: string | null
        }
        Insert: {
          created_at?: string
          data_theme: string
          id?: string
          title: string
          type?: Database["public"]["Enums"]["theme_type"]
          unlock_criteria?: string | null
        }
        Update: {
          created_at?: string
          data_theme?: string
          id?: string
          title?: string
          type?: Database["public"]["Enums"]["theme_type"]
          unlock_criteria?: string | null
        }
        Relationships: []
      }
      unlocked_achievements: {
        Row: {
          achievement_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unlocked_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unlocked_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      unlocked_themes: {
        Row: {
          created_at: string
          theme_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          theme_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          theme_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unlocked_themes_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unlocked_themes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_statistics: {
        Row: {
          created_at: string
          quizzes_completed: number
          user_id: string
        }
        Insert: {
          created_at?: string
          quizzes_completed?: number
          user_id: string
        }
        Update: {
          created_at?: string
          quizzes_completed?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_statistics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      usernames: {
        Row: {
          created_at: string
          deleted: boolean
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          deleted?: boolean
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          about_me: string | null
          created_at: string
          deleted: boolean
          first_name: string
          last_name: string
          middle_name: string | null
          onboarding_step: Database["public"]["Enums"]["onboarding_type"]
          role: Database["public"]["Enums"]["user_type"]
          theme_id: string | null
          user_id: string
          username: string
        }
        Insert: {
          about_me?: string | null
          created_at?: string
          deleted?: boolean
          first_name?: string
          last_name?: string
          middle_name?: string | null
          onboarding_step?: Database["public"]["Enums"]["onboarding_type"]
          role?: Database["public"]["Enums"]["user_type"]
          theme_id?: string | null
          user_id?: string
          username?: string
        }
        Update: {
          about_me?: string | null
          created_at?: string
          deleted?: boolean
          first_name?: string
          last_name?: string
          middle_name?: string | null
          onboarding_step?: Database["public"]["Enums"]["onboarding_type"]
          role?: Database["public"]["Enums"]["user_type"]
          theme_id?: string | null
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_to_user_stat: {
        Args: { p_amount: number; p_attr: string }
        Returns: undefined
      }
    }
    Enums: {
      achievement_type: "quizzes_completed"
      notification_type:
        | "friend_request_received"
        | "friend_request_accepted"
        | "like_received"
        | "achievement_unlocked"
      onboarding_type:
        | "completed"
        | "basic_info"
        | "username"
        | "privacy"
        | "theme"
      theme_type: "light" | "dark"
      user_type: "student" | "instructor"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      achievement_type: ["quizzes_completed"],
      notification_type: [
        "friend_request_received",
        "friend_request_accepted",
        "like_received",
        "achievement_unlocked",
      ],
      onboarding_type: [
        "completed",
        "basic_info",
        "username",
        "privacy",
        "theme",
      ],
      theme_type: ["light", "dark"],
      user_type: ["student", "instructor"],
    },
  },
} as const
