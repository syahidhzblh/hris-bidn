import { supabase, handleSupabaseError } from '../lib/supabase';
import { Database } from '../types/database';

type LeaveRequest = Database['public']['Tables']['leave_requests']['Row'];
type LeaveInsert = Database['public']['Tables']['leave_requests']['Insert'];
type LeaveUpdate = Database['public']['Tables']['leave_requests']['Update'];

export class LeaveService {
  static async getLeaveRequests(employeeId?: string): Promise<LeaveRequest[]> {
    try {
      let query = supabase
        .from('leave_requests')
        .select(`
          *,
          employee:employees!leave_requests_employee_id_fkey(
            id,
            employee_id,
            position,
            profile:profiles!employees_profile_id_fkey(
              full_name,
              avatar_url
            )
          ),
          approver:employees!leave_requests_approver_id_fkey(
            profile:profiles!employees_profile_id_fkey(
              full_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      throw new Error(handleSupabaseError(error));
    }
  }

  static async createLeaveRequest(leaveData: LeaveInsert): Promise<LeaveRequest> {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .insert(leaveData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating leave request:', error);
      throw new Error(handleSupabaseError(error));
    }
  }

  static async updateLeaveRequest(
    id: string,
    updates: LeaveUpdate
  ): Promise<LeaveRequest> {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating leave request:', error);
      throw new Error(handleSupabaseError(error));
    }
  }

  static async approveLeaveRequest(
    id: string,
    approverId: string
  ): Promise<LeaveRequest> {
    return this.updateLeaveRequest(id, {
      status: 'approved',
      approver_id: approverId,
      approved_at: new Date().toISOString()
    });
  }

  static async rejectLeaveRequest(
    id: string,
    approverId: string,
    reason?: string
  ): Promise<LeaveRequest> {
    return this.updateLeaveRequest(id, {
      status: 'rejected',
      approver_id: approverId,
      approved_at: new Date().toISOString(),
      rejection_reason: reason
    });
  }

  static async getLeaveBalance(employeeId: string, year?: number) {
    try {
      const targetYear = year || new Date().getFullYear();
      
      const { data, error } = await supabase
        .from('leave_requests')
        .select('leave_type, days_requested')
        .eq('employee_id', employeeId)
        .eq('status', 'approved')
        .gte('start_date', `${targetYear}-01-01`)
        .lte('end_date', `${targetYear}-12-31`);

      if (error) throw error;

      const usedLeave = {
        annual: 0,
        sick: 0,
        emergency: 0,
        maternity: 0,
        paternity: 0,
        other: 0
      };

      (data || []).forEach(request => {
        usedLeave[request.leave_type] += request.days_requested;
      });

      // Standard leave entitlements (can be made configurable)
      const entitlements = {
        annual: 12,
        sick: 12,
        emergency: 3,
        maternity: 90,
        paternity: 7,
        other: 0
      };

      const balance = {
        annual: entitlements.annual - usedLeave.annual,
        sick: entitlements.sick - usedLeave.sick,
        emergency: entitlements.emergency - usedLeave.emergency,
        maternity: entitlements.maternity - usedLeave.maternity,
        paternity: entitlements.paternity - usedLeave.paternity,
        other: entitlements.other - usedLeave.other
      };

      return {
        used: usedLeave,
        entitlements,
        balance
      };
    } catch (error) {
      console.error('Error fetching leave balance:', error);
      throw new Error(handleSupabaseError(error));
    }
  }
}