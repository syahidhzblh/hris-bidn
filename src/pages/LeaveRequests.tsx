import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Filter, Search, Check, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { LeaveService } from '../services/leaveService';
import { EmployeeService } from '../services/employeeService';
import { useRealtime } from '../hooks/useRealtime';

export default function LeaveRequests() {
  const { user } = useAuth();
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<any>(null);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    leave_type: 'annual' as any,
    start_date: '',
    end_date: '',
    reason: ''
  });

  // Real-time subscription for leave requests
  useRealtime('leave_requests', (payload) => {
    console.log('Leave request update:', payload);
    loadLeaveRequests();
  });

  const loadEmployeeData = async () => {
    if (!user?.id) return;

    try {
      const employee = await EmployeeService.getEmployeeByProfileId(user.id);
      setCurrentEmployee(employee);
      return employee;
    } catch (error) {
      console.error('Error loading employee data:', error);
    }
  };

  const loadLeaveRequests = async () => {
    try {
      let requests;
      if (user?.profile?.role === 'admin' || user?.profile?.role === 'manager') {
        // Load all requests for admin/manager
        requests = await LeaveService.getLeaveRequests();
      } else if (currentEmployee?.id) {
        // Load only own requests for employee
        requests = await LeaveService.getLeaveRequests(currentEmployee.id);
      } else {
        requests = [];
      }
      setLeaveRequests(requests);
    } catch (error) {
      console.error('Error loading leave requests:', error);
    }
  };

  const loadLeaveBalance = async () => {
    if (!currentEmployee?.id) return;

    try {
      const balance = await LeaveService.getLeaveBalance(currentEmployee.id);
      setLeaveBalance(balance);
    } catch (error) {
      console.error('Error loading leave balance:', error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      const employee = await loadEmployeeData();
      if (employee || user?.profile?.role === 'admin' || user?.profile?.role === 'manager') {
        await Promise.all([
          loadLeaveRequests(),
          employee ? loadLeaveBalance() : Promise.resolve()
        ]);
      }
      setLoading(false);
    };

    initializeData();
  }, [user?.id]);

  useEffect(() => {
    if (currentEmployee) {
      loadLeaveRequests();
      loadLeaveBalance();
    }
  }, [currentEmployee]);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmployee?.id) return;

    setSubmitting(true);
    try {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      await LeaveService.createLeaveRequest({
        employee_id: currentEmployee.id,
        leave_type: formData.leave_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        days_requested: daysDiff,
        reason: formData.reason
      });

      setShowNewRequest(false);
      setFormData({
        leave_type: 'annual',
        start_date: '',
        end_date: '',
        reason: ''
      });
      
      await loadLeaveRequests();
      await loadLeaveBalance();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    if (!currentEmployee?.id) return;

    try {
      await LeaveService.approveLeaveRequest(requestId, currentEmployee.id);
      await loadLeaveRequests();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!currentEmployee?.id) return;

    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await LeaveService.rejectLeaveRequest(requestId, currentEmployee.id, reason);
      await loadLeaveRequests();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const filteredRequests = leaveRequests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = request.employee?.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
        {currentEmployee && (
          <button
            onClick={() => setShowNewRequest(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </button>
        )}
      </div>

      {/* Leave Balance Cards */}
      {leaveBalance && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Annual Leave</p>
                <p className="text-2xl font-bold text-gray-900">{leaveBalance.balance.annual}</p>
                <p className="text-xs text-gray-500">Days remaining</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sick Leave</p>
                <p className="text-2xl font-bold text-gray-900">{leaveBalance.balance.sick}</p>
                <p className="text-xs text-gray-500">Days remaining</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Used This Year</p>
                <p className="text-2xl font-bold text-gray-900">
                  {leaveBalance.used.annual + leaveBalance.used.sick + leaveBalance.used.emergency}
                </p>
                <p className="text-xs text-gray-500">Total days</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {leaveRequests.filter(req => req.status === 'pending').length}
                </p>
                <p className="text-xs text-gray-500">Awaiting approval</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by employee name or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-400 mr-2" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Leave Requests</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Employee</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Start Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">End Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Days</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Reason</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-900 font-medium">
                      {request.employee?.profile?.full_name || 'Unknown'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                        {request.leave_type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-900">
                      {format(new Date(request.start_date), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-4 px-6 text-gray-900">
                      {format(new Date(request.end_date), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-4 px-6 text-gray-900">{request.days_requested}</td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate">{request.reason}</td>
                    <td className="py-4 px-6">
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
                    <td className="py-4 px-6">
                      {request.status === 'pending' && (user?.profile?.role === 'admin' || user?.profile?.role === 'manager') && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-gray-500">
                    No leave requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      {showNewRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">New Leave Request</h3>
            
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                <select 
                  value={formData.leave_type}
                  onChange={(e) => setFormData({...formData, leave_type: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="emergency">Emergency Leave</option>
                  <option value="maternity">Maternity Leave</option>
                  <option value="paternity">Paternity Leave</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please provide a reason for your leave request..."
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewRequest(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}