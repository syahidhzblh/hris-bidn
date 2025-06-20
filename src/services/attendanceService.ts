import { attendanceAPI } from '../lib/api';

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  clock_in?: string;
  clock_out?: string;
  clock_in_location?: string;
  clock_out_location?: string;
  clock_in_photo?: string;
  clock_out_photo?: string;
  status: 'present' | 'absent' | 'late' | 'half_day';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceStats {
  total_days: number;
  present_days: number;
  late_days: number;
  absent_days: number;
  average_hours: number;
}

export class AttendanceService {
  static async getTodayAttendance(employeeId: string): Promise<AttendanceRecord | null> {
    try {
      const response = await attendanceAPI.getTodayAttendance(employeeId);
      return response.data.attendance;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch today attendance');
    }
  }

  static async getAttendanceHistory(employeeId: string, limit?: number): Promise<AttendanceRecord[]> {
    try {
      const response = await attendanceAPI.getAttendanceHistory(employeeId, limit);
      return response.data.attendance;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch attendance history');
    }
  }

  static async getAttendanceStats(employeeId: string, month?: number, year?: number): Promise<AttendanceStats> {
    try {
      const response = await attendanceAPI.getAttendanceStats(employeeId, month, year);
      return response.data.stats;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch attendance stats');
    }
  }

  static async clockIn(employeeId: string, location?: string, photoUrl?: string): Promise<AttendanceRecord> {
    try {
      const response = await attendanceAPI.clockIn(employeeId, {
        location,
        photo_url: photoUrl
      });
      return response.data.attendance;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to clock in');
    }
  }

  static async clockOut(employeeId: string, location?: string, photoUrl?: string): Promise<AttendanceRecord> {
    try {
      const response = await attendanceAPI.clockOut(employeeId, {
        location,
        photo_url: photoUrl
      });
      return response.data.attendance;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to clock out');
    }
  }
}