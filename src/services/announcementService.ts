import { supabase, handleSupabaseError } from '../lib/supabase';
import { Database } from '../types/database';

type Announcement = Database['public']['Tables']['announcements']['Row'];
type AnnouncementInsert = Database['public']['Tables']['announcements']['Insert'];

export interface AnnouncementWithAuthor extends Announcement {
  author?: {
    full_name: string;
    avatar_url?: string;
  };
}

export class AnnouncementService {
  static async getAnnouncements(): Promise<AnnouncementWithAuthor[]> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          author:profiles!announcements_published_by_fkey(
            full_name,
            avatar_url
          )
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw new Error(handleSupabaseError(error));
    }
  }

  static async createAnnouncement(
    announcementData: AnnouncementInsert
  ): Promise<Announcement> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert({
          ...announcementData,
          published_at: announcementData.is_published ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw new Error(handleSupabaseError(error));
    }
  }

  static async updateAnnouncement(
    id: string,
    updates: Partial<Announcement>
  ): Promise<Announcement> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw new Error(handleSupabaseError(error));
    }
  }

  static async deleteAnnouncement(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw new Error(handleSupabaseError(error));
    }
  }
}