import { supabase, handleSupabaseError } from '../lib/supabase';
import { Database } from '../types/database';

type AttendanceRecord = Database['public']['Tables']['attendance_records']['Row'];
type AttendanceInsert = Database['public']['Tables']['attendance_records']['Insert'];
type AttendanceUpdate = Database['public']['Tables']['attendance_records']['Update'];

export class AttendanceService {
  static async getTodayAttendance(employeeId: string): Promise<AttendanceRecord | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching today attendance:', error);
      throw new Error(handleSupabaseError(error));
    }
  }

  static async getAttendanceHistory(
    employeeId: string,
    limit: number = 30
  ): Promise<AttendanceRecord[]> {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('employee_id', employeeId)
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      throw new Error(handleSupabaseError(error));
    }
  }

  static async clockIn(
    employeeId: string,
    location?: string,
    photoUrl?: string
  ): Promise<AttendanceRecord> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();

      // Check if already clocked in today
      const existing = await this.getTodayAttendance(employeeId);
      if (existing?.clock_in) {
        throw new Error('Already clocked in today');
      }

      const attendanceData: AttendanceInsert = {
        employee_id: employeeId,
        date: today,
        clock_in: now,
        clock_in_location: location,
        clock_in_photo: photoUrl,
        status: 'present'
      };

      const { data, error } = await supabase
        .from('attendance_records')
        .upsert(attendanceData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error clocking in:', error);
      throw new Error(handleSupabaseError(error));
    }
  }

  static async clockOut(
    employeeId: string,
    location?: string,
    photoUrl?: string
  ): Promise<AttendanceRecord> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();

      // Get today's attendance record
      const existing = await this.getTodayAttendance(employeeId);
      if (!existing) {
        throw new Error('No clock-in record found for today');
      }

      if (existing.clock_out) {
        throw new Error('Already clocked out today');
      }

      const { data, error } = await supabase
        .from('attendance_records')
        .update({
          clock_out: now,
          clock_out_location: location,
          clock_out_photo: photoUrl
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error clocking out:', error);
      throw new Error(handleSupabaseError(error));
    }
  }

  static async getAttendanceStats(employeeId: string, month?: number, year?: number) {
    try {
      const currentDate = new Date();
      const targetMonth = month || currentDate.getMonth() + 1;
      const targetYear = year || currentDate.getFullYear();

      const startDate = `${targetYear}-${targetMonth.toString().padStart(2, '0')}-01`;
      const endDate = new Date(targetYear, targetMonth, 0).toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('employee_id', employeeId)
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) throw error;

      const records = data || [];
      const stats = {
        totalDays: records.length,
        presentDays: records.filter(r => r.status === 'present').length,
        lateDays: records.filter(r => r.status === 'late').length,
        absentDays: records.filter(r => r.status === 'absent').length,
        averageHours: 0
      };

      // Calculate average hours
      const hoursWorked = records
        .filter(r => r.clock_in && r.clock_out)
        .map(r => {
          const clockIn = new Date(r.clock_in!);
          const clockOut = new Date(r.clock_out!);
          return (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
        });

      if (hoursWorked.length > 0) {
        stats.averageHours = hoursWorked.reduce((a, b) => a + b, 0) / hoursWorked.length;
      }

      return stats;
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      throw new Error(handleSupabaseError(error));
    }
  }
}