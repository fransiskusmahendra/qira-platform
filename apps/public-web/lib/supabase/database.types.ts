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
      audit_events: {
        Row: {
          action: string
          actor_id: string
          id: string
          occurred_at: string
          organization_id: string
          reason: string | null
          resource_id: string
          resource_type: string
          result: string
        }
        Insert: {
          action: string
          actor_id: string
          id?: string
          occurred_at?: string
          organization_id: string
          reason?: string | null
          resource_id: string
          resource_type: string
          result: string
        }
        Update: {
          action?: string
          actor_id?: string
          id?: string
          occurred_at?: string
          organization_id?: string
          reason?: string | null
          resource_id?: string
          resource_type?: string
          result?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      discoveries: {
        Row: {
          created_at: string
          created_by: string
          id: string
          organization_id: string
          responses: Json
          scores: Json
          service_ids: string[]
          status: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          organization_id: string
          responses?: Json
          scores?: Json
          service_ids?: string[]
          status?: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          organization_id?: string
          responses?: Json
          scores?: Json
          service_ids?: string[]
          status?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "discoveries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_snapshots: {
        Row: {
          approved_at: string
          approved_by: string
          checksum_sha256: string
          discovery_id: string
          discovery_version: number
          id: string
          organization_id: string
          snapshot: Json
        }
        Insert: {
          approved_at?: string
          approved_by: string
          checksum_sha256: string
          discovery_id: string
          discovery_version: number
          id?: string
          organization_id: string
          snapshot: Json
        }
        Update: never
        Relationships: []
      }
      evidence: {
        Row: {
          checksum_sha256: string
          created_at: string
          discovery_id: string
          id: string
          mime_type: string
          object_path: string
          organization_id: string
          original_name: string
          scan_provider: string | null
          scan_reference: string | null
          scan_status: string
          scanned_at: string | null
          scanned_by: string | null
          size_bytes: number
          uploaded_by: string
        }
        Insert: {
          checksum_sha256: string
          created_at?: string
          discovery_id: string
          id?: string
          mime_type: string
          object_path: string
          organization_id: string
          original_name: string
          scan_provider?: string | null
          scan_reference?: string | null
          scan_status?: string
          scanned_at?: string | null
          scanned_by?: string | null
          size_bytes: number
          uploaded_by: string
        }
        Update: {
          scan_provider?: string | null
          scan_reference?: string | null
          scan_status?: string
          scanned_at?: string | null
          scanned_by?: string | null
        }
        Relationships: []
      }
      memberships: {
        Row: {
          created_at: string
          organization_id: string
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          organization_id: string
          role: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          organization_id?: string
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      proposal_versions: {
        Row: {
          created_at: string
          created_by: string
          id: string
          organization_id: string
          proposal_id: string
          snapshot: Json
          version: number
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          organization_id: string
          proposal_id: string
          snapshot: Json
          version: number
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          organization_id?: string
          proposal_id?: string
          snapshot?: Json
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposal_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposal_versions_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_exports: {
        Row: { checksum_sha256: string; format: string; generated_at: string; generated_by: string; id: string; organization_id: string; proposal_id: string; proposal_version: number }
        Insert: { checksum_sha256: string; format?: string; generated_at?: string; generated_by: string; id?: string; organization_id: string; proposal_id: string; proposal_version: number }
        Update: never
        Relationships: []
      }
      proposal_email_deliveries: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          organization_id: string
          proposal_id: string
          provider_message_id: string | null
          recipient_email: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          organization_id: string
          proposal_id: string
          provider_message_id?: string | null
          recipient_email: string
          status?: string
          updated_at?: string
        }
        Update: {
          error_message?: string | null
          provider_message_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          client_name: string
          commercial_terms: Json
          created_at: string
          created_by: string
          discovery_id: string | null
          discovery_snapshot_id: string | null
          id: string
          issue_date: string
          organization_id: string
          proposal_number: string
          recipient_name: string
          recipient_email: string | null
          status: string
          updated_at: string
          valid_until: string
          version: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          client_name: string
          commercial_terms: Json
          created_at?: string
          created_by: string
          discovery_id?: string | null
          discovery_snapshot_id?: string | null
          id?: string
          issue_date: string
          organization_id: string
          proposal_number: string
          recipient_name: string
          recipient_email?: string | null
          status?: string
          updated_at?: string
          valid_until: string
          version?: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          client_name?: string
          commercial_terms?: Json
          created_at?: string
          created_by?: string
          discovery_id?: string | null
          discovery_snapshot_id?: string | null
          id?: string
          issue_date?: string
          organization_id?: string
          proposal_number?: string
          recipient_name?: string
          recipient_email?: string | null
          status?: string
          updated_at?: string
          valid_until?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposals_discovery_id_fkey"
            columns: ["discovery_id"]
            isOneToOne: false
            referencedRelation: "discoveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      save_discovery_draft: {
        Args: {
          response_payload: Json
          score_payload: Json
          selected_service_ids: string[]
          target_discovery_id: string | null
          target_organization_id: string
        }
        Returns: Database["public"]["Tables"]["discoveries"]["Row"][]
      }
      record_proposal_export: {
        Args: { pdf_checksum_sha256: string; target_proposal_id: string }
        Returns: string
      }
      transition_discovery: {
        Args: {
          target_discovery_id: string
          target_status: string
          transition_reason?: string | null
        }
        Returns: Database["public"]["Tables"]["discoveries"]["Row"][]
      }
      create_proposal: {
        Args: {
          client: string
          issued_on: string
          proposal_no: string
          recipient: string
          recipient_email_address: string
          source_discovery_id: string
          target_organization_id: string
          terms: Json
          valid_through: string
        }
        Returns: string
      }
      transition_proposal: {
        Args: { target_proposal_id: string; target_status: string }
        Returns: {
          approved_at: string | null
          approved_by: string | null
          client_name: string
          commercial_terms: Json
          created_at: string
          created_by: string
          discovery_id: string | null
          discovery_snapshot_id: string | null
          id: string
          issue_date: string
          organization_id: string
          proposal_number: string
          recipient_name: string
          recipient_email: string | null
          status: string
          updated_at: string
          valid_until: string
          version: number
        }
        SetofOptions: {
          from: "*"
          to: "proposals"
          isOneToOne: true
          isSetofReturn: false
        }
      }
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
