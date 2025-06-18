import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle,
  AlertCircle,
  Bell,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AnnouncementService, AnnouncementWithAuthor } from '../services/announcementService';
import { LeaveService } from '../services/leaveService';
import { EmployeeService } from '../services/employeeService';
import { AttendanceService } from '../services/attendanceService';
import { useAnnouncementsRealtime } from '../hooks/useRealtime';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<AnnouncementWithAuthor[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    lateToday: 0
  });
  const [loading, setLoading] = useState(true);

  // Real-time subscription for announcements
  useAnnouncementsRealtime((payload) => {
    console.log('Announcement update:', payload);
    loadAnnouncements();
  });

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load announcements
      const announcementsData = await AnnouncementService.getAnnouncements();
      setAnnouncements(announcementsData.slice(0, 3));

      // Load leave requests
      const leaveData = await LeaveService.getLeaveRequests();
      setLeaveRequests(leaveData.slice(0, 5));

      // Load employees for stats
      const employees = await EmployeeService.getEmployees();
      const pendingLeaves = leaveData.filter(req => req.status === 'pending').length;

      setStats({
        totalEmployees: employees.length,
        presentToday: Math.floor(employees.length * 0.95), // Mock data
        pendingLeaves,
        lateToday: Math.floor(employees.length * 0.05) // Mock data
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnnouncements = async () => {
    try {
      const data = await AnnouncementService.getAnnouncements();
      setAnnouncements(data.slice(0, 3));
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const statsCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'blue',
      change: '+2 this month'
    },
    {
      title: 'Present Today',
      value: stats.presentToday,
      icon: CheckCircle,
      color: 'green',
      change: '95% attendance'
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves,
      icon: Calendar,
      color: 'yellow',
      change: 'Needs review'
    },
    {
      title: 'Late Today',
      value: stats.lateToday,
      icon: AlertCircle,
      color: 'red',
      change: '5% of workforce'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      red: 'bg-red-50 text-red-600'
    };
    return colors[color as keyof typeof colors];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.profile?.full_name || user?.email}!
        </h1>
        <p className="text-blue-100">
          {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-blue-600" />
              Recent Announcements
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">View all</button>
          </div>
          
          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div key={announcement.id} className="border-l-4 border-blue-400 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {announcement.published_at && format(new Date(announcement.published_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      announcement.announcement_type === 'urgent' 
                        ? 'bg-red-100 text-red-800'
                        : announcement.announcement_type === 'event'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {announcement.announcement_type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No announcements yet</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Clock className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900">Clock In/Out</h3>
              <p className="text-sm text-gray-600">Mark attendance</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Calendar className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900">Request Leave</h3>
              <p className="text-sm text-gray-600">Submit time off</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <FileText className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-medium text-gray-900">View Payslip</h3>
              <p className="text-sm text-gray-600">Check salary</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Users className="h-8 w-8 text-orange-600 mb-2" />
              <h3 className="font-medium text-gray-900">Directory</h3>
              <p className="text-sm text-gray-600">Find colleagues</p>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Leave Requests */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Leave Requests</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Employee</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Dates</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.length > 0 ? (
                leaveRequests.map((request) => (
                  <tr key={request.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">
                      {request.employee?.profile?.full_name || 'Unknown'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                        {request.leave_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {format(new Date(request.start_date), 'MMM dd')} - {format(new Date(request.end_date), 'MMM dd')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {request.status === 'pending' && (user?.profile?.role === 'admin' || user?.profile?.role === 'manager') && (
                        <div className="flex space-x-2">
                          <button className="text-green-600 hover:text-green-700 text-sm">Approve</button>
                          <button className="text-red-600 hover:text-red-700 text-sm">Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    No leave requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}