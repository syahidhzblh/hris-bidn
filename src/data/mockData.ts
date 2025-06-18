import { Employee, AttendanceRecord, LeaveRequest, Announcement, Document } from '../types';

export const mockEmployees: Employee[] = [
  {
    id: '1',
    userId: '1',
    nik: 'EMP001',
    name: 'Sarah Johnson',
    position: 'HR Manager',
    division: 'Human Resources',
    joinDate: '2022-01-15',
    status: 'active',
    email: 'sarah@company.com',
    phone: '+1-555-0101',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    userId: '2',
    nik: 'EMP002',
    name: 'Michael Chen',
    position: 'Engineering Manager',
    division: 'Technology',
    joinDate: '2021-03-10',
    status: 'active',
    email: 'michael@company.com',
    phone: '+1-555-0102',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    userId: '3',
    nik: 'EMP003',
    name: 'Emily Rodriguez',
    position: 'Software Developer',
    division: 'Technology',
    joinDate: '2022-06-01',
    status: 'active',
    email: 'emily@company.com',
    phone: '+1-555-0103',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '4',
    userId: '4',
    nik: 'EMP004',
    name: 'David Kim',
    position: 'Product Designer',
    division: 'Design',
    joinDate: '2022-08-15',
    status: 'active',
    email: 'david@company.com',
    phone: '+1-555-0104',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '5',
    userId: '5',
    nik: 'EMP005',
    name: 'Lisa Wang',
    position: 'Marketing Specialist',
    division: 'Marketing',
    joinDate: '2023-02-01',
    status: 'active',
    email: 'lisa@company.com',
    phone: '+1-555-0105',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=100&h=100&fit=crop&crop=face'
  }
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: '3',
    date: '2024-01-15',
    clockIn: '08:30',
    clockOut: '17:15',
    status: 'present',
    location: 'Office Main Building'
  },
  {
    id: '2',
    employeeId: '3',
    date: '2024-01-14',
    clockIn: '09:15',
    clockOut: '17:30',
    status: 'late',
    location: 'Office Main Building'
  },
  {
    id: '3',
    employeeId: '3',
    date: '2024-01-13',
    clockIn: '08:00',
    clockOut: '16:00',
    status: 'present',
    location: 'Office Main Building'
  }
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '3',
    employeeName: 'Emily Rodriguez',
    type: 'annual',
    startDate: '2024-02-05',
    endDate: '2024-02-07',
    days: 3,
    reason: 'Family vacation',
    status: 'pending',
    submittedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    employeeId: '4',
    employeeName: 'David Kim',
    type: 'sick',
    startDate: '2024-01-18',
    endDate: '2024-01-19',
    days: 2,
    reason: 'Flu symptoms',
    status: 'approved',
    approver: 'Michael Chen',
    submittedAt: '2024-01-17T14:20:00Z',
    processedAt: '2024-01-17T16:45:00Z'
  },
  {
    id: '3',
    employeeId: '5',
    employeeName: 'Lisa Wang',
    type: 'emergency',
    startDate: '2024-01-16',
    endDate: '2024-01-16',
    days: 1,
    reason: 'Family emergency',
    status: 'approved',
    approver: 'Sarah Johnson',
    submittedAt: '2024-01-15T08:00:00Z',
    processedAt: '2024-01-15T09:15:00Z'
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'New Health Insurance Policy',
    content: 'We are pleased to announce updates to our health insurance coverage, effective February 1st.',
    type: 'general',
    publishedAt: '2024-01-12T09:00:00Z',
    publishedBy: 'Sarah Johnson',
    targetAudience: ['all']
  },
  {
    id: '2',
    title: 'System Maintenance Schedule',
    content: 'HRIS system will undergo maintenance on January 20th from 2 AM to 4 AM.',
    type: 'urgent',
    publishedAt: '2024-01-14T16:30:00Z',
    publishedBy: 'IT Department',
    targetAudience: ['all']
  },
  {
    id: '3',
    title: 'Team Building Event',
    content: 'Annual team building event scheduled for March 15th. Registration opens next week.',
    type: 'event',
    publishedAt: '2024-01-10T11:00:00Z',
    publishedBy: 'HR Team',
    targetAudience: ['all']
  }
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    employeeId: '3',
    name: 'Employment Contract',
    type: 'contract',
    fileUrl: '#',
    uploadedAt: '2022-06-01T09:00:00Z',
    size: 245760
  },
  {
    id: '2',
    employeeId: '3',
    name: 'Tax Form W-2',
    type: 'tax-document',
    fileUrl: '#',
    uploadedAt: '2024-01-02T14:30:00Z',
    expiresAt: '2025-04-15T23:59:59Z',
    size: 89432
  }
];