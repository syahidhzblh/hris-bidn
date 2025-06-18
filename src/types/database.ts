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
      announcements: {
        Row: {
          announcement_type: Database["public"]["Enums"]["announcement_type"] | null
          content: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          published_by: string | null
          target_divisions: string[] | null
          target_roles: Database["public"]["Enums"]["user_role"][] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          announcement_type?: Database["public"]["Enums"]["announcement_type"] | null
          content: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          published_by?: string | null
          target_divisions?: string[] | null
          target_roles?: Database["public"]["Enums"]["user_role"][] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          announcement_type?: Database["public"]["Enums"]["announcement_type"] | null
          content?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          published_by?: string | null
          target_divisions?: string[] | null
          target_roles?: Database["public"]["Enums"]["user_role"][] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_published_by_fkey"
            columns: ["published_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      attendance_records: {
        Row: {
          clock_in: string | null
          clock_in_location: string | null
          clock_in_photo: string | null
          clock_out: string | null
          clock_out_location: string | null
          clock_out_photo: string | null
          created_at: string | null
          date: string
          employee_id: string | null
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["attendance_status"] | null
          updated_at: string | null
        }
        Insert: {
          clock_in?: string | null
          clock_in_location?: string | null
          clock_in_photo?: string | null
          clock_out?: string | null
          clock_out_location?: string | null
          clock_out_photo?: string | null
          created_at?: string | null
          date: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["attendance_status"] | null
          updated_at?: string | null
        }
        Update: {
          clock_in?: string | null
          clock_in_location?: string | null
          clock_in_photo?: string | null
          clock_out?: string | null
          clock_out_location?: string | null
          clock_out_photo?: string | null
          created_at?: string | null
          date?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["attendance_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_employee_id_fkey"
            columns: ["employee_id"]
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
      }
      divisions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          manager_id: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          manager_id?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string | null
          document_type: string
          employee_id: string | null
          expires_at: string | null
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          name: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          employee_id?: string | null
          expires_at?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          name: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          employee_id?: string | null
          expires_at?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          name?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      employees: {
        Row: {
          address: string | null
          created_at: string | null
          division_id: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          employee_id: string
          employment_status: Database["public"]["Enums"]["employment_status"] | null
          id: string
          join_date: string
          position: string
          profile_id: string | null
          salary_base: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          division_id?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          employee_id: string
          employment_status?: Database["public"]["Enums"]["employment_status"] | null
          id?: string
          join_date: string
          position: string
          profile_id?: string | null
          salary_base?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          division_id?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          employee_id?: string
          employment_status?: Database["public"]["Enums"]["employment_status"] | null
          id?: string
          join_date?: string
          position?: string
          profile_id?: string | null
          salary_base?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approver_id: string | null
          created_at: string | null
          days_requested: number
          employee_id: string | null
          end_date: string
          id: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason: string
          rejection_reason: string | null
          start_date: string
          status: Database["public"]["Enums"]["leave_status"] | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approver_id?: string | null
          created_at?: string | null
          days_requested: number
          employee_id?: string | null
          end_date: string
          id?: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason: string
          rejection_reason?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approver_id?: string | null
          created_at?: string | null
          days_requested?: number
          employee_id?: string | null
          end_date?: string
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          reason?: string
          rejection_reason?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
      }
      payroll_components: {
        Row: {
          amount: number | null
          component_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          is_percentage: boolean | null
          name: string
          percentage: number | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          component_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_percentage?: boolean | null
          name: string
          percentage?: number | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          component_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_percentage?: boolean | null
          name?: string
          percentage?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      salary_records: {
        Row: {
          allowances: Json | null
          base_salary: number
          created_at: string | null
          deductions: Json | null
          employee_id: string | null
          gross_salary: number
          id: string
          net_salary: number
          period_month: number
          period_year: number
          processed_at: string | null
          processed_by: string | null
          tax_amount: number | null
        }
        Insert: {
          allowances?: Json | null
          base_salary: number
          created_at?: string | null
          deductions?: Json | null
          employee_id?: string | null
          gross_salary: number
          id?: string
          net_salary: number
          period_month: number
          period_year: number
          processed_at?: string | null
          processed_by?: string | null
          tax_amount?: number | null
        }
        Update: {
          allowances?: Json | null
          base_salary?: number
          created_at?: string | null
          deductions?: Json | null
          employee_id?: string | null
          gross_salary?: number
          id?: string
          net_salary?: number
          period_month?: number
          period_year?: number
          processed_at?: string | null
          processed_by?: string | null
          tax_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "salary_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_records_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      announcement_type: "general" | "urgent" | "event"
      attendance_status: "present" | "absent" | "late" | "half_day"
      employment_status: "active" | "inactive" | "terminated"
      leave_status: "pending" | "approved" | "rejected"
      leave_type: "annual" | "sick" | "emergency" | "maternity" | "paternity" | "other"
      user_role: "admin" | "manager" | "employee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}