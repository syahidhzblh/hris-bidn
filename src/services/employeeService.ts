import { supabase, handleSupabaseError } from '../lib/supabase';
import { Database } from '../types/database';

type Employee = Database['public']['Tables']['employees']['Row'];
type EmployeeInsert = Database['public']['Tables']['employees']['Insert'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export interface EmployeeWithProfile extends Employee {
  profile?: Profile;
  division?: {
    id: string;
    name: string;
  };
}

export class EmployeeService {
  static async getEmployees(): Promise<EmployeeWithProfile[]> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          profile:profiles!employees_profile_id_fkey(*),
          division:divisions!employees_division_id_fkey(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw new Error(handleSupabaseError(error));
    }
  }

  static async getEmployeeByProfileId(profileId: string): Promise<EmployeeWithProfile | null> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          profile:profiles!employees_profile_id_fkey(*),
          division:divisions!employees_division_id_fkey(id, name)
        `)
        .eq('profile_id', profileId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching employee by profile ID:', error);
      throw new Error(handleSupabaseError(error));
    }
  }

  static async createEmployee(employeeData: EmployeeInsert): Promise<Employee> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert(employeeData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw new Error(handleSupabaseError(error));
    }
  }

  static async updateEmployee(
    id: string,
    updates: Partial<Employee>
  ): Promise<Employee> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw new Error(handleSupabaseError(error));
    }
  }

  static async getDivisions() {
    try {
      const { data, error } = await supabase
        .from('divisions')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching divisions:', error);
      throw new Error(handleSupabaseError(error));
    }
  }
}