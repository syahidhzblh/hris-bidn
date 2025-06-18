import React, { useState } from 'react';
import { Clock, MapPin, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { mockAttendance } from '../data/mockData';

export default function Attendance() {
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = async () => {
    setIsClockingIn(true);
    // Simulate API call
    setTimeout(() => {
      setIsClockingIn(false);
      // In real app, would update attendance state
    }, 2000);
  };

  const todayAttendance = mockAttendance.find(
    record => record.date === format(new Date(), 'yyyy-MM-dd')
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <div className="text-sm text-gray-500">
          {format(currentTime, 'EEEE, MMMM do, yyyy')}
        </div>
      </div>

      {/* Clock In/Out Card */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="mb-6">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {format(currentTime, 'HH:mm:ss')}
            </div>
            <div className="flex items-center justify-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              Office Main Building
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={handleClockIn}
              disabled={isClockingIn}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Clock className="h-5 w-5 mr-2" />
              {isClockingIn ? 'Processing...' : 'Clock In'}
            </button>
            
            <button
              className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <Clock className="h-5 w-5 mr-2" />
              Clock Out
            </button>
          </div>

          {todayAttendance && (
            <div className="flex justify-center space-x-8 text-sm">
              <div className="text-center">
                <p className="text-gray-600">Clock In</p>
                <p className="font-semibold text-green-600">{todayAttendance.clockIn}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Clock Out</p>
                <p className="font-semibold text-red-600">
                  {todayAttendance.clockOut || '--:--'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Status</p>
                <div className="flex items-center justify-center">
                  {todayAttendance.status === 'present' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  )}
                  <span className={`ml-1 font-semibold capitalize ${
                    todayAttendance.status === 'present' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {todayAttendance.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">22</p>
              <p className="text-xs text-green-600">Present Days</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Late Days</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-yellow-600">This Month</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absent Days</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
              <p className="text-xs text-red-600">This Month</p>
            </div>
            <Calendar className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Hours</p>
              <p className="text-2xl font-bold text-gray-900">8.2</p>
              <p className="text-xs text-blue-600">Per Day</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Attendance History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Clock In</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Clock Out</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Hours</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Location</th>
              </tr>
            </thead>
            <tbody>
              {mockAttendance.map((record) => {
                const clockIn = record.clockIn ? new Date(`2024-01-01T${record.clockIn}`) : null;
                const clockOut = record.clockOut ? new Date(`2024-01-01T${record.clockOut}`) : null;
                const hours = clockIn && clockOut 
                  ? ((clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60)).toFixed(1)
                  : '--';

                return (
                  <tr key={record.id} className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-900">
                      {format(new Date(record.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-4 px-6 text-gray-900">{record.clockIn || '--:--'}</td>
                    <td className="py-4 px-6 text-gray-900">{record.clockOut || '--:--'}</td>
                    <td className="py-4 px-6 text-gray-900">{hours}h</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'present'
                          ? 'bg-green-100 text-green-800'
                          : record.status === 'late'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{record.location}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}