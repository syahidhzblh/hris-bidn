export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
}

export interface Employee {
  id: string;
  userId: string;
  nik: string;
  name: string;
  position: string;
  division: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'terminated';
  email: string;
  phone: string;
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  location?: string;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'annual' | 'sick' | 'emergency' | 'maternity' | 'other';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approver?: string;
  submittedAt: string;
  processedAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'event';
  publishedAt: string;
  publishedBy: string;
  targetAudience: string[];
}

export interface Document {
  id: string;
  employeeId: string;
  name: string;
  type: string;
  fileUrl: string;
  uploadedAt: string;
  expiresAt?: string;
  size: number;
}