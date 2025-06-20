import { leaveAPI } from '../lib/api';

export interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type: 'annual' | 'sick' | 'emergency' | 'maternity' | 'paternity' | 'other';
  start_date: string;
  end_date: string;
  days_requested: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approver_id?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  employee_name?: string;
  employee_avatar?: string;
  approver_name?: string;
}

export interface LeaveBalance {
  used: Record<string, number>;
  entitlements: Record<string, number>;
  balance: Record<string, number>;
}

export class LeaveService {
  static async getLeaveRequests(employeeId?: string): Promise<LeaveRequest[]> {
    try {
      const response = await leaveAPI.getLeaveRequests(employeeId);
      return response.data.leave_requests;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch leave requests');
    }
  }

  static async createLeaveRequest(leaveData: any): Promise<LeaveRequest> {
    try {
      const response = await leaveAPI.createLeaveRequest(leaveData);
      return response.data.leave_request;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create leave request');
    }
  }

  static async approveLeaveRequest(id: string, approverId: string): Promise<LeaveRequest> {
    try {
      const response = await leaveAPI.updateLeaveRequest(id, {
        status: 'approved',
        approver_id: approverId
      });
      return response.data.leave_request;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to approve leave request');
    }
  }

  static async rejectLeaveRequest(id: string, approverId: string, reason?: string): Promise<LeaveRequest> {
    try {
      const response = await leaveAPI.updateLeaveRequest(id, {
        status: 'rejected',
        approver_id: approverId,
        rejection_reason: reason
      });
      return response.data.leave_request;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reject leave request');
    }
  }

  static async getLeaveBalance(employeeId: string, year?: number): Promise<LeaveBalance> {
    try {
      const response = await leaveAPI.getLeaveBalance(employeeId, year);
      return response.data.balance;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch leave balance');
    }
  }
}