import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Mail, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { EmployeeService, EmployeeWithProfile } from '../services/employeeService';

export default function Employees() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<EmployeeWithProfile[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDivision, setFilterDivision] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [employeesData, divisionsData] = await Promise.all([
        EmployeeService.getEmployees(),
        EmployeeService.getDivisions()
      ]);
      
      setEmployees(employeesData);
      setDivisions(divisionsData);
    } catch (error) {
      console.error('Error loading employees data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision = filterDivision === 'all' || employee.division?.id === filterDivision;
    const matchesStatus = filterStatus === 'all' || employee.employment_status === filterStatus;
    
    return matchesSearch && matchesDivision && matchesStatus;
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
        <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
        {(user?.profile?.role === 'admin') && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            <p className="text-sm text-gray-600">Total Employees</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {employees.filter(emp => emp.employment_status === 'active').length}
            </p>
            <p className="text-sm text-gray-600">Active</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{divisions.length}</p>
            <p className="text-sm text-gray-600">Divisions</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {employees.filter(emp => {
                const joinDate = new Date(emp.join_date);
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
              }).length}
            </p>
            <p className="text-sm text-gray-600">New This Month</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees by name, position, or email..."
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
                value={filterDivision}
                onChange={(e) => setFilterDivision(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Divisions</option>
                {divisions.map(division => (
                  <option key={division.id} value={division.id}>{division.name}</option>
                ))}
              </select>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="terminated">Terminated</option>
            </select>

            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm font-medium ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                } rounded-l-lg transition-colors`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm font-medium ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                } rounded-r-lg transition-colors`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-center">
                <img
                  src={employee.profile?.avatar_url || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=80&h=80&fit=crop&crop=face'}
                  alt={employee.profile?.full_name || 'Employee'}
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {employee.profile?.full_name || 'Unknown'}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{employee.position}</p>
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {employee.division?.name || 'No Division'}
                </span>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {employee.profile?.email || 'No email'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {employee.profile?.phone || 'No phone'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {format(new Date(employee.join_date), 'MMM yyyy')}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employee.employment_status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : employee.employment_status === 'inactive'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.employment_status}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Employee</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Position</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Division</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Email</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Phone</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Join Date</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b border-gray-100">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <img
                          src={employee.profile?.avatar_url || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=40&h=40&fit=crop&crop=face'}
                          alt={employee.profile?.full_name || 'Employee'}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {employee.profile?.full_name || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-500">{employee.employee_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{employee.position}</td>
                    <td className="py-4 px-6 text-gray-900">{employee.division?.name || 'No Division'}</td>
                    <td className="py-4 px-6 text-gray-900">{employee.profile?.email || 'No email'}</td>
                    <td className="py-4 px-6 text-gray-900">{employee.profile?.phone || 'No phone'}</td>
                    <td className="py-4 px-6 text-gray-900">
                      {format(new Date(employee.join_date), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        employee.employment_status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : employee.employment_status === 'inactive'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.employment_status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No employees found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}