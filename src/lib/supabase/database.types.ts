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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json
          id: number
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json
          id?: never
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json
          id?: never
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_facts: {
        Row: {
          category: string | null
          created_at: string | null
          embedding: string | null
          fact: string
          id: string
          importance: number | null
          metadata: Json | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          embedding?: string | null
          fact: string
          id?: string
          importance?: number | null
          metadata?: Json | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          embedding?: string | null
          fact?: string
          id?: string
          importance?: number | null
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      ai_goals: {
        Row: {
          created_at: string | null
          deadline: string | null
          description: string | null
          goal: string
          id: string
          metadata: Json | null
          progress: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          goal: string
          id?: string
          metadata?: Json | null
          progress?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          goal?: string
          id?: string
          metadata?: Json | null
          progress?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_job_applications: {
        Row: {
          applied_at: string | null
          cover_letter: string | null
          created_at: string | null
          id: string
          job_id: string | null
          metadata: Json | null
          notes: string | null
          response_at: string | null
          resume_url: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          metadata?: Json | null
          notes?: string | null
          response_at?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          applied_at?: string | null
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          metadata?: Json | null
          notes?: string | null
          response_at?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_job_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_learning_progress: {
        Row: {
          created_at: string | null
          id: string
          last_activity: string | null
          milestones: Json | null
          progress: number | null
          skill: string
          started_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_activity?: string | null
          milestones?: Json | null
          progress?: number | null
          skill: string
          started_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_activity?: string | null
          milestones?: Json | null
          progress?: number | null
          skill?: string
          started_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_memory: {
        Row: {
          category: string
          confidence: number | null
          created_at: string | null
          deleted_at: string | null
          id: string
          key: string
          source: string | null
          updated_at: string | null
          user_id: string
          value: string
        }
        Insert: {
          category: string
          confidence?: number | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          key: string
          source?: string | null
          updated_at?: string | null
          user_id: string
          value: string
        }
        Update: {
          category?: string
          confidence?: number | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          key?: string
          source?: string | null
          updated_at?: string | null
          user_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_memory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_skill_memory: {
        Row: {
          confidence: number | null
          created_at: string | null
          embedding: string | null
          id: string
          last_assessed: string | null
          level: string | null
          skill: string
          source: string | null
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          last_assessed?: string | null
          level?: string | null
          skill: string
          source?: string | null
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          last_assessed?: string | null
          level?: string | null
          skill?: string
          source?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_usage_log: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_user_goals: {
        Row: {
          created_at: string | null
          goal_text: string
          goal_type: string
          id: string
          metadata: Json | null
          progress: number | null
          status: string | null
          target_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          goal_text: string
          goal_type: string
          id?: string
          metadata?: Json | null
          progress?: number | null
          status?: string | null
          target_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          goal_text?: string
          goal_type?: string
          id?: string
          metadata?: Json | null
          progress?: number | null
          status?: string | null
          target_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_user_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_user_preferences: {
        Row: {
          career_goals: string[] | null
          communication_tone: string | null
          created_at: string | null
          embedding: string | null
          id: string
          interests: string[] | null
          learning_style: string | null
          metadata: Json | null
          target_roles: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          career_goals?: string[] | null
          communication_tone?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          interests?: string[] | null
          learning_style?: string | null
          metadata?: Json | null
          target_roles?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          career_goals?: string[] | null
          communication_tone?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          interests?: string[] | null
          learning_style?: string | null
          metadata?: Json | null
          target_roles?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_id: string | null
          actor_role: Database["public"]["Enums"]["user_role"] | null
          created_at: string
          description: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_id?: string | null
          actor_role?: Database["public"]["Enums"]["user_role"] | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          actor_id?: string | null
          actor_role?: Database["public"]["Enums"]["user_role"] | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          agent_id: string
          created_at: string | null
          embedding: string | null
          id: string
          message_count: number | null
          messages: Json | null
          org_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          message_count?: number | null
          messages?: Json | null
          org_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          message_count?: number | null
          messages?: Json | null
          org_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_notes: {
        Row: {
          action_label: string | null
          action_url: string | null
          content: string
          created_at: string
          deleted_at: string | null
          expires_at: string | null
          id: string
          org_id: string | null
          priority: number
          type: Database["public"]["Enums"]["coach_note_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          content: string
          created_at?: string
          deleted_at?: string | null
          expires_at?: string | null
          id?: string
          org_id?: string | null
          priority?: number
          type?: Database["public"]["Enums"]["coach_note_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          content?: string
          created_at?: string
          deleted_at?: string | null
          expires_at?: string | null
          id?: string
          org_id?: string | null
          priority?: number
          type?: Database["public"]["Enums"]["coach_note_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_notes_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_reactions: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          reaction_type?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          proof_card_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          proof_card_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          proof_card_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_proof_card_id_fkey"
            columns: ["proof_card_id"]
            isOneToOne: false
            referencedRelation: "proof_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          assigned_to: string | null
          created_at: string
          deleted_at: string | null
          email: string
          id: string
          ip_address: unknown
          message: string
          name: string
          resolved_at: string | null
          status: Database["public"]["Enums"]["contact_status"]
          subject: string | null
          updated_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          id?: string
          ip_address?: unknown
          message: string
          name: string
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["contact_status"]
          subject?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: string
          ip_address?: unknown
          message?: string
          name?: string
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["contact_status"]
          subject?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string | null
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          conversation_type: string | null
          created_at: string | null
          id: string
          last_message_at: string | null
          last_message_preview: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          conversation_type?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          conversation_type?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          data: Json | null
          error: string | null
          id: string
          org_id: string | null
          result: Json | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          data?: Json | null
          error?: string | null
          id?: string
          org_id?: string | null
          result?: Json | null
          status?: string
          type: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          data?: Json | null
          error?: string | null
          id?: string
          org_id?: string | null
          result?: Json | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          proof_card_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          proof_card_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          proof_card_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_proof_card_id_fkey"
            columns: ["proof_card_id"]
            isOneToOne: false
            referencedRelation: "proof_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          delivered_at: string | null
          encryption_iv: string | null
          encryption_salt: string | null
          id: string
          message_type: string | null
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          delivered_at?: string | null
          encryption_iv?: string | null
          encryption_salt?: string | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          delivered_at?: string | null
          encryption_iv?: string | null
          encryption_salt?: string | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      misbehavior_flags: {
        Row: {
          created_at: string
          details: Json
          id: number
          reviewed_at: string | null
          reviewed_by: string | null
          severity: string
          status: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json
          id?: never
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity: string
          status?: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json
          id?: never
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: string
          status?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "misbehavior_flags_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "misbehavior_flags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          coach_tips: boolean
          created_at: string
          digest_frequency: string
          opportunity_matches: boolean
          product_updates: boolean
          push_enabled: boolean
          recruiter_views: boolean
          updated_at: string
          user_id: string
          verification_changes: boolean
          weekly_summary: boolean
        }
        Insert: {
          coach_tips?: boolean
          created_at?: string
          digest_frequency?: string
          opportunity_matches?: boolean
          product_updates?: boolean
          push_enabled?: boolean
          recruiter_views?: boolean
          updated_at?: string
          user_id: string
          verification_changes?: boolean
          weekly_summary?: boolean
        }
        Update: {
          coach_tips?: boolean
          created_at?: string
          digest_frequency?: string
          opportunity_matches?: boolean
          product_updates?: boolean
          push_enabled?: boolean
          recruiter_views?: boolean
          updated_at?: string
          user_id?: string
          verification_changes?: boolean
          weekly_summary?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          deleted_at: string | null
          id: string
          link: string | null
          payload: Json
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          link?: string | null
          payload?: Json
          read_at?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          link?: string | null
          payload?: Json
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          apply_deadline: string | null
          company: string
          company_logo_url: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean
          is_remote: boolean
          link: string
          location: string | null
          match_percentage: number
          metadata: Json
          nice_to_have: string[]
          posted_at: string | null
          required_skills: string[]
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          source: string | null
          source_external_id: string | null
          title: string
          type: Database["public"]["Enums"]["opportunity_type"]
          updated_at: string
        }
        Insert: {
          apply_deadline?: string | null
          company: string
          company_logo_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_remote?: boolean
          link: string
          location?: string | null
          match_percentage?: number
          metadata?: Json
          nice_to_have?: string[]
          posted_at?: string | null
          required_skills?: string[]
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          source?: string | null
          source_external_id?: string | null
          title: string
          type?: Database["public"]["Enums"]["opportunity_type"]
          updated_at?: string
        }
        Update: {
          apply_deadline?: string | null
          company?: string
          company_logo_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_remote?: boolean
          link?: string
          location?: string | null
          match_percentage?: number
          metadata?: Json
          nice_to_have?: string[]
          posted_at?: string | null
          required_skills?: string[]
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          source?: string | null
          source_external_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["opportunity_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      org_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          org_id: string
          role: Database["public"]["Enums"]["org_role"]
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          org_id: string
          role?: Database["public"]["Enums"]["org_role"]
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          org_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_invitations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_invitations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          id: string
          invited_by: string | null
          joined_at: string
          org_id: string
          role: Database["public"]["Enums"]["org_role"]
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          org_id: string
          role?: Database["public"]["Enums"]["org_role"]
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          org_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          owner_id: string
          plan: Database["public"]["Enums"]["subscription_plan"] | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          owner_id: string
          plan?: Database["public"]["Enums"]["subscription_plan"] | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"] | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          deleted_at: string | null
          id: string
          is_edited: boolean | null
          like_count: number | null
          org_id: string | null
          parent_id: string | null
          post_id: string
          reply_count: number | null
          reply_to_user_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_edited?: boolean | null
          like_count?: number | null
          org_id?: string | null
          parent_id?: string | null
          post_id: string
          reply_count?: number | null
          reply_to_user_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_edited?: boolean | null
          like_count?: number | null
          org_id?: string | null
          parent_id?: string | null
          post_id?: string
          reply_count?: number | null
          reply_to_user_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_reply_to_user_id_fkey"
            columns: ["reply_to_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          reaction_type?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          bookmark_count: number | null
          comment_count: number | null
          content: string
          created_at: string | null
          deleted_at: string | null
          hashtags: string[] | null
          id: string
          is_pinned: boolean | null
          like_count: number | null
          media_urls: Json | null
          mentions: string[] | null
          metadata: Json | null
          org_id: string | null
          post_type: string | null
          reply_to_id: string | null
          repost_count: number | null
          repost_of_id: string | null
          updated_at: string | null
          user_id: string
          view_count: number | null
          visibility: string | null
        }
        Insert: {
          bookmark_count?: number | null
          comment_count?: number | null
          content: string
          created_at?: string | null
          deleted_at?: string | null
          hashtags?: string[] | null
          id?: string
          is_pinned?: boolean | null
          like_count?: number | null
          media_urls?: Json | null
          mentions?: string[] | null
          metadata?: Json | null
          org_id?: string | null
          post_type?: string | null
          reply_to_id?: string | null
          repost_count?: number | null
          repost_of_id?: string | null
          updated_at?: string | null
          user_id: string
          view_count?: number | null
          visibility?: string | null
        }
        Update: {
          bookmark_count?: number | null
          comment_count?: number | null
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          hashtags?: string[] | null
          id?: string
          is_pinned?: boolean | null
          like_count?: number | null
          media_urls?: Json | null
          mentions?: string[] | null
          metadata?: Json | null
          org_id?: string | null
          post_type?: string | null
          reply_to_id?: string | null
          repost_count?: number | null
          repost_of_id?: string | null
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_repost_of_id_fkey"
            columns: ["repost_of_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          class_name: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          role: string
          student_id: string | null
        }
        Insert: {
          class_name?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          is_active?: boolean
          role?: string
          student_id?: string | null
        }
        Update: {
          class_name?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          role?: string
          student_id?: string | null
        }
        Relationships: []
      }
      proof_cards: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          is_highlighted: boolean
          metadata: Json
          org_id: string | null
          skills_extracted: string[]
          skills_user_added: string[]
          sort_order: number
          source_type: Database["public"]["Enums"]["proof_source_type"]
          source_url: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
          view_count: number
          visibility: Database["public"]["Enums"]["visibility_status"]
          what_it_proves: string[]
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_highlighted?: boolean
          metadata?: Json
          org_id?: string | null
          skills_extracted?: string[]
          skills_user_added?: string[]
          sort_order?: number
          source_type: Database["public"]["Enums"]["proof_source_type"]
          source_url?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          view_count?: number
          visibility?: Database["public"]["Enums"]["visibility_status"]
          what_it_proves?: string[]
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_highlighted?: boolean
          metadata?: Json
          org_id?: string | null
          skills_extracted?: string[]
          skills_user_added?: string[]
          sort_order?: number
          source_type?: Database["public"]["Enums"]["proof_source_type"]
          source_url?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          view_count?: number
          visibility?: Database["public"]["Enums"]["visibility_status"]
          what_it_proves?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "proof_cards_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proof_cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      proof_shares: {
        Row: {
          created_at: string
          deleted_at: string | null
          expires_at: string | null
          id: string
          kind: Database["public"]["Enums"]["share_token_kind"]
          last_viewed_at: string | null
          message: string | null
          owner_id: string
          proof_id: string
          recipient_email: string
          recipient_name: string | null
          token: string | null
          updated_at: string
          view_count: number
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          expires_at?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["share_token_kind"]
          last_viewed_at?: string | null
          message?: string | null
          owner_id: string
          proof_id: string
          recipient_email: string
          recipient_name?: string | null
          token?: string | null
          updated_at?: string
          view_count?: number
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          expires_at?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["share_token_kind"]
          last_viewed_at?: string | null
          message?: string | null
          owner_id?: string
          proof_id?: string
          recipient_email?: string
          recipient_name?: string | null
          token?: string | null
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "proof_shares_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proof_shares_proof_id_fkey"
            columns: ["proof_id"]
            isOneToOne: false
            referencedRelation: "proof_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      proof_sources: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          is_connected: boolean
          last_synced_at: string | null
          metadata: Json
          source_name: string | null
          source_type: Database["public"]["Enums"]["proof_source_type"]
          source_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_connected?: boolean
          last_synced_at?: string | null
          metadata?: Json
          source_name?: string | null
          source_type: Database["public"]["Enums"]["proof_source_type"]
          source_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_connected?: boolean
          last_synced_at?: string | null
          metadata?: Json
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["proof_source_type"]
          source_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proof_sources_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      proof_views: {
        Row: {
          id: string
          ip_address: unknown
          owner_id: string
          proof_id: string
          referer: string | null
          user_agent: string | null
          viewed_at: string | null
          viewer_user_id: string | null
        }
        Insert: {
          id?: string
          ip_address?: unknown
          owner_id: string
          proof_id: string
          referer?: string | null
          user_agent?: string | null
          viewed_at?: string | null
          viewer_user_id?: string | null
        }
        Update: {
          id?: string
          ip_address?: unknown
          owner_id?: string
          proof_id?: string
          referer?: string | null
          user_agent?: string | null
          viewed_at?: string | null
          viewer_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proof_views_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proof_views_proof_id_fkey"
            columns: ["proof_id"]
            isOneToOne: false
            referencedRelation: "proof_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proof_views_viewer_user_id_fkey"
            columns: ["viewer_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          endpoint: string
          id: string
          is_active: boolean
          p256dh: string
          platform: string | null
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string
          endpoint: string
          id?: string
          is_active?: boolean
          p256dh: string
          platform?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string
          endpoint?: string
          id?: string
          is_active?: boolean
          p256dh?: string
          platform?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          created_at: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          resource_type: string
          title: string
          topic_slug: string | null
          unit_slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          resource_type: string
          title: string
          topic_slug?: string | null
          unit_slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          resource_type?: string
          title?: string
          topic_slug?: string | null
          unit_slug?: string
        }
        Relationships: []
      }
      shared_messages: {
        Row: {
          agent_name: string
          content: string
          created_at: string | null
          expires_at: string | null
          id: string
          role: string
          share_id: string
          thinking: string | null
        }
        Insert: {
          agent_name?: string
          content: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          role?: string
          share_id: string
          thinking?: string | null
        }
        Update: {
          agent_name?: string
          content?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          role?: string
          share_id?: string
          thinking?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          confidence: number | null
          created_at: string | null
          id: string
          last_used_at: string | null
          level: string | null
          name: string
          source: string | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          category?: string | null
          confidence?: number | null
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          level?: string | null
          name: string
          source?: string | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          category?: string | null
          confidence?: number | null
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          level?: string | null
          name?: string
          source?: string | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      social_notifications: {
        Row: {
          action_type: string
          actor_id: string | null
          created_at: string | null
          entity_id: string
          entity_preview: string | null
          entity_type: string
          id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          actor_id?: string | null
          created_at?: string | null
          entity_id: string
          entity_preview?: string | null
          entity_type: string
          id?: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          actor_id?: string | null
          created_at?: string | null
          entity_id?: string
          entity_preview?: string | null
          entity_type?: string
          id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          deleted_at: string | null
          id: string
          metadata: Json
          plan: Database["public"]["Enums"]["subscription_plan"]
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          deleted_at?: string | null
          id?: string
          metadata?: Json
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          deleted_at?: string | null
          id?: string
          metadata?: Json
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_integrations: {
        Row: {
          access_token: string | null
          created_at: string
          deleted_at: string | null
          external_user_id: string | null
          external_username: string | null
          id: string
          last_synced_at: string | null
          metadata: Json
          provider: Database["public"]["Enums"]["auth_provider"]
          refresh_token: string | null
          scopes: string[]
          status: Database["public"]["Enums"]["integration_status"]
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          deleted_at?: string | null
          external_user_id?: string | null
          external_username?: string | null
          id?: string
          last_synced_at?: string | null
          metadata?: Json
          provider: Database["public"]["Enums"]["auth_provider"]
          refresh_token?: string | null
          scopes?: string[]
          status?: Database["public"]["Enums"]["integration_status"]
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          deleted_at?: string | null
          external_user_id?: string | null
          external_username?: string | null
          id?: string
          last_synced_at?: string | null
          metadata?: Json
          provider?: Database["public"]["Enums"]["auth_provider"]
          refresh_token?: string | null
          scopes?: string[]
          status?: Database["public"]["Enums"]["integration_status"]
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_opportunities: {
        Row: {
          applied_at: string | null
          created_at: string
          id: string
          match_score: number | null
          notes: string | null
          opportunity_id: string
          org_id: string | null
          source: string | null
          status: Database["public"]["Enums"]["opportunity_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          created_at?: string
          id?: string
          match_score?: number | null
          notes?: string | null
          opportunity_id: string
          org_id?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_at?: string | null
          created_at?: string
          id?: string
          match_score?: number | null
          notes?: string | null
          opportunity_id?: string
          org_id?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_opportunities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_opportunities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_opportunities_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_opportunities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"]
          auth_provider: Database["public"]["Enums"]["auth_provider"]
          auth_user_id: string | null
          avatar_url: string | null
          bio: string | null
          college: string | null
          created_at: string
          current_org_id: string | null
          deleted_at: string | null
          email: string
          email_verified: boolean
          full_name: string | null
          github_url: string | null
          headline: string | null
          hide_email: boolean
          id: string
          is_profile_public: boolean
          last_login_at: string | null
          linkedin_url: string | null
          location: string | null
          onboarded: boolean
          public_key: string | null
          registration_ip: unknown
          registration_ua: string | null
          role: Database["public"]["Enums"]["user_role"]
          twitter_url: string | null
          updated_at: string
          username: string
          website_url: string | null
          year: Database["public"]["Enums"]["student_year"] | null
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"]
          auth_provider?: Database["public"]["Enums"]["auth_provider"]
          auth_user_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          college?: string | null
          created_at?: string
          current_org_id?: string | null
          deleted_at?: string | null
          email: string
          email_verified?: boolean
          full_name?: string | null
          github_url?: string | null
          headline?: string | null
          hide_email?: boolean
          id?: string
          is_profile_public?: boolean
          last_login_at?: string | null
          linkedin_url?: string | null
          location?: string | null
          onboarded?: boolean
          public_key?: string | null
          registration_ip?: unknown
          registration_ua?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          twitter_url?: string | null
          updated_at?: string
          username: string
          website_url?: string | null
          year?: Database["public"]["Enums"]["student_year"] | null
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"]
          auth_provider?: Database["public"]["Enums"]["auth_provider"]
          auth_user_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          college?: string | null
          created_at?: string
          current_org_id?: string | null
          deleted_at?: string | null
          email?: string
          email_verified?: boolean
          full_name?: string | null
          github_url?: string | null
          headline?: string | null
          hide_email?: boolean
          id?: string
          is_profile_public?: boolean
          last_login_at?: string | null
          linkedin_url?: string | null
          location?: string | null
          onboarded?: boolean
          public_key?: string | null
          registration_ip?: unknown
          registration_ua?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          twitter_url?: string | null
          updated_at?: string
          username?: string
          website_url?: string | null
          year?: Database["public"]["Enums"]["student_year"] | null
        }
        Relationships: [
          {
            foreignKeyName: "users_current_org_id_fkey"
            columns: ["current_org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      opportunity_details: {
        Row: {
          apply_deadline: string | null
          company: string | null
          company_logo_url: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string | null
          is_active: boolean | null
          is_remote: boolean | null
          link: string | null
          location: string | null
          match_percentage: number | null
          metadata: Json | null
          my_applied_at: string | null
          my_match_score: number | null
          my_notes: string | null
          my_status: string | null
          nice_to_have: string[] | null
          posted_at: string | null
          required_skills: string[] | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          source: string | null
          source_external_id: string | null
          title: string | null
          type: Database["public"]["Enums"]["opportunity_type"] | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_coach_notes: { Args: never; Returns: undefined }
      cleanup_old_ai_usage: { Args: never; Returns: undefined }
      count_recent_actions: {
        Args: { p_action: string; p_user_id: string; p_window: string }
        Returns: number
      }
      count_recent_failed_logins: {
        Args: { p_email: string; p_window: string }
        Returns: number
      }
      current_user_id: { Args: never; Returns: string }
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      flag_failed_logins: { Args: { p_email: string }; Returns: undefined }
      generate_daily_tips: { Args: never; Returns: undefined }
      generate_weekly_coach_notes: { Args: never; Returns: undefined }
      get_comment_count: { Args: { target_proof_id: string }; Returns: number }
      get_follow_counts: {
        Args: { target_user_id: string }
        Returns: {
          follower_count: number
          following_count: number
        }[]
      }
      get_follower_count: { Args: { target_user_id: string }; Returns: number }
      get_following_count: { Args: { target_user_id: string }; Returns: number }
      get_like_count: { Args: { target_proof_id: string }; Returns: number }
      has_liked: {
        Args: { target_proof_id: string; target_user_id: string }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_admin_or_mod: { Args: never; Returns: boolean }
      is_following: {
        Args: { follower: string; following: string }
        Returns: boolean
      }
      is_valid_email: { Args: { email: string }; Returns: boolean }
      is_valid_url: { Args: { url: string }; Returns: boolean }
      jsonb_is_object: { Args: { v: Json }; Returns: boolean }
      owns_proof: { Args: { p_proof_id: string }; Returns: boolean }
      recent_flag_exists: {
        Args: { p_type: string; p_user_id: string; p_window: string }
        Returns: boolean
      }
      refresh_platform_analytics: { Args: never; Returns: undefined }
      search_memories_semantic: {
        Args: {
          max_results?: number
          query_embedding: string
          similarity_threshold?: number
          user_id_param: string
        }
        Returns: {
          content: string
          id: string
          memory_type: string
          metadata: Json
          similarity: number
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      slugify_username: { Args: { p_input: string }; Returns: string }
      trigger_hourly_notifications: { Args: never; Returns: undefined }
    }
    Enums: {
      account_status: "active" | "pending" | "suspended" | "deactivated"
      audit_action:
        | "create"
        | "update"
        | "delete"
        | "soft_delete"
        | "restore"
        | "login"
        | "export"
        | "admin_action"
      auth_provider: "email" | "google" | "github" | "apple" | "linkedin"
      coach_note_type: "daily" | "weekly" | "milestone" | "ad_hoc"
      contact_status: "new" | "in_progress" | "resolved" | "spam"
      integration_status: "connected" | "disconnected" | "pending" | "error"
      notification_type:
        | "recruiter_view"
        | "verification_update"
        | "opportunity_match"
        | "coach_tip"
        | "weekly_summary"
        | "system"
      opportunity_status:
        | "saved"
        | "applied"
        | "dismissed"
        | "interviewing"
        | "rejected"
        | "offered"
      opportunity_type:
        | "internship"
        | "job"
        | "scholarship"
        | "mentorship"
        | "hackathon"
        | "research"
        | "other"
      org_role: "owner" | "admin" | "member" | "viewer"
      proof_source_type:
        | "github"
        | "kaggle"
        | "certificate"
        | "hackathon"
        | "project"
        | "blog"
        | "demo"
        | "other"
      share_token_kind: "link" | "email" | "recruiter_invite"
      student_year: "first" | "second" | "third" | "fourth" | "graduate"
      subscription_plan: "free" | "pro" | "team" | "university"
      subscription_status:
        | "active"
        | "canceled"
        | "past_due"
        | "trialing"
        | "incomplete"
      user_role: "user" | "admin" | "moderator" | "employer" | "university"
      verification_status: "draft" | "pending" | "verified" | "rejected"
      visibility_status: "private" | "unlisted" | "public"
    }
    CompositeTypes: {
      proof_card_summary: {
        id: string | null
        title: string | null
        source_type: Database["public"]["Enums"]["proof_source_type"] | null
        verification_status:
          | Database["public"]["Enums"]["verification_status"]
          | null
        visibility: Database["public"]["Enums"]["visibility_status"] | null
        skills: string[] | null
        view_count: number | null
        created_at: string | null
      }
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
    Enums: {
      account_status: ["active", "pending", "suspended", "deactivated"],
      audit_action: [
        "create",
        "update",
        "delete",
        "soft_delete",
        "restore",
        "login",
        "export",
        "admin_action",
      ],
      auth_provider: ["email", "google", "github", "apple", "linkedin"],
      coach_note_type: ["daily", "weekly", "milestone", "ad_hoc"],
      contact_status: ["new", "in_progress", "resolved", "spam"],
      integration_status: ["connected", "disconnected", "pending", "error"],
      notification_type: [
        "recruiter_view",
        "verification_update",
        "opportunity_match",
        "coach_tip",
        "weekly_summary",
        "system",
      ],
      opportunity_status: [
        "saved",
        "applied",
        "dismissed",
        "interviewing",
        "rejected",
        "offered",
      ],
      opportunity_type: [
        "internship",
        "job",
        "scholarship",
        "mentorship",
        "hackathon",
        "research",
        "other",
      ],
      org_role: ["owner", "admin", "member", "viewer"],
      proof_source_type: [
        "github",
        "kaggle",
        "certificate",
        "hackathon",
        "project",
        "blog",
        "demo",
        "other",
      ],
      share_token_kind: ["link", "email", "recruiter_invite"],
      student_year: ["first", "second", "third", "fourth", "graduate"],
      subscription_plan: ["free", "pro", "team", "university"],
      subscription_status: [
        "active",
        "canceled",
        "past_due",
        "trialing",
        "incomplete",
      ],
      user_role: ["user", "admin", "moderator", "employer", "university"],
      verification_status: ["draft", "pending", "verified", "rejected"],
      visibility_status: ["private", "unlisted", "public"],
    },
  },
} as const
