import React from 'react';
import { 
  Clock, 
  Calendar, 
  Users, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Bell,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockAnnouncements, mockLeaveRequests, mockEmployees } from '../data/mockData';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Employees',
      value: mockEmployees.length,
      icon: Users,
      color: 'blue',
      change: '+2 this month'
    },
    {
      title: 'Present Today',
      value: 42,
      icon: CheckCircle,
      color: 'green',
      change: '95% attendance'
    },
    {
      title: 'Pending Leaves',
      value: mockLeaveRequests.filter(r => r.status === 'pending').length,
      icon: Calendar,
      color: 'yellow',
      change: 'Needs review'
    },
    {
      title: 'Late Today',
      value: 3,
      icon: AlertCircle,
      color: 'red',
      change: '6% of workforce'
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

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-blue-100">
          {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
            {mockAnnouncements.slice(0, 3).map((announcement) => (
              <div key={announcement.id} className="border-l-4 border-blue-400 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {format(new Date(announcement.publishedAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    announcement.type === 'urgent' 
                      ? 'bg-red-100 text-red-800'
                      : announcement.type === 'event'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {announcement.type}
                  </span>
                </div>
              </div>
            ))}
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

      {/* Recent Activity */}
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
              {mockLeaveRequests.slice(0, 5).map((request) => (
                <tr key={request.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">{request.employeeName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                      {request.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {format(new Date(request.startDate), 'MMM dd')} - {format(new Date(request.endDate), 'MMM dd')}
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
                    {request.status === 'pending' && (user?.role === 'admin' || user?.role === 'manager') && (
                      <div className="flex space-x-2">
                        <button className="text-green-600 hover:text-green-700 text-sm">Approve</button>
                        <button className="text-red-600 hover:text-red-700 text-sm">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}