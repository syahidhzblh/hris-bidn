import { announcementAPI } from '../lib/api';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  announcement_type: 'general' | 'urgent' | 'event';
  published_by: string;
  published_at?: string;
  expires_at?: string;
  target_roles?: string[];
  target_divisions?: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
  author_name?: string;
  author_avatar?: string;
}

export class AnnouncementService {
  static async getAnnouncements(): Promise<Announcement[]> {
    try {
      const response = await announcementAPI.getAnnouncements();
      return response.data.announcements;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch announcements');
    }
  }

  static async createAnnouncement(announcementData: any): Promise<Announcement> {
    try {
      const response = await announcementAPI.createAnnouncement(announcementData);
      return response.data.announcement;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create announcement');
    }
  }

  static async updateAnnouncement(id: string, updates: any): Promise<Announcement> {
    try {
      const response = await announcementAPI.updateAnnouncement(id, updates);
      return response.data.announcement;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update announcement');
    }
  }

  static async deleteAnnouncement(id: string): Promise<void> {
    try {
      await announcementAPI.deleteAnnouncement(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete announcement');
    }
  }
}