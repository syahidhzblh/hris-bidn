import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Bell, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { AnnouncementService, AnnouncementWithAuthor } from '../services/announcementService';
import { useAnnouncementsRealtime } from '../hooks/useRealtime';

export default function Announcements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<AnnouncementWithAuthor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    announcement_type: 'general' as any,
    target_roles: ['admin', 'manager', 'employee'] as any[]
  });

  // Real-time subscription for announcements
  useAnnouncementsRealtime((payload) => {
    console.log('Announcement update:', payload);
    loadAnnouncements();
  });

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await AnnouncementService.getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleSubmitAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSubmitting(true);
    try {
      await AnnouncementService.createAnnouncement({
        title: formData.title,
        content: formData.content,
        announcement_type: formData.announcement_type,
        published_by: user.id,
        target_roles: formData.target_roles,
        is_published: true
      });

      setShowNewAnnouncement(false);
      setFormData({
        title: '',
        content: '',
        announcement_type: 'general',
        target_roles: ['admin', 'manager', 'employee']
      });
      
      await loadAnnouncements();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || announcement.announcement_type === filterType;
    
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'event':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return '🚨';
      case 'event':
        return '📅';
      default:
        return '📢';
    }
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        {(user?.profile?.role === 'admin' || user?.profile?.role === 'manager') && (
          <button
            onClick={() => setShowNewAnnouncement(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
            <p className="text-sm text-gray-600">Total Announcements</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {announcements.filter(a => a.announcement_type === 'general').length}
            </p>
            <p className="text-sm text-gray-600">General</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {announcements.filter(a => a.announcement_type === 'urgent').length}
            </p>
            <p className="text-sm text-gray-600">Urgent</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {announcements.filter(a => a.announcement_type === 'event').length}
            </p>
            <p className="text-sm text-gray-600">Events</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <Filter className="h-4 w-4 text-gray-400 mr-2" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="general">General</option>
              <option value="urgent">Urgent</option>
              <option value="event">Event</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{getTypeIcon(announcement.announcement_type || 'general')}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        <span className="mr-4">{announcement.author?.full_name || 'Unknown'}</span>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {announcement.published_at && format(new Date(announcement.published_at), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {announcement.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(announcement.announcement_type || 'general')}`}>
                      {(announcement.announcement_type || 'general').toUpperCase()}
                    </span>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Bell className="h-4 w-4 mr-1" />
                      <span>Sent to {announcement.target_roles?.join(', ') || 'all'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No announcements found.</p>
          </div>
        )}
      </div>

      {/* New Announcement Modal */}
      {showNewAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Announcement</h3>
            
            <form onSubmit={handleSubmitAnnouncement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter announcement title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select 
                  value={formData.announcement_type}
                  onChange={(e) => setFormData({...formData, announcement_type: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="urgent">Urgent</option>
                  <option value="event">Event</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <div className="space-y-2">
                  {['admin', 'manager', 'employee'].map(role => (
                    <label key={role} className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={formData.target_roles.includes(role as any)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData, 
                              target_roles: [...formData.target_roles, role as any]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              target_roles: formData.target_roles.filter(r => r !== role)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{role}s</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write your announcement content here..."
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewAnnouncement(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}