import { useEffect, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useRealtime(
  table: string,
  callback: (payload: any) => void,
  filter?: string,
  dependencies: any[] = []
) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    // Clean up existing subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create new subscription
    const channel = supabase
      .channel(`${table}_changes_${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter
        },
        callback
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [table, filter, ...dependencies]);

  return channelRef.current;
}

export function useAttendanceRealtime(employeeId: string, callback: (payload: any) => void) {
  return useRealtime(
    'attendance_records',
    callback,
    `employee_id=eq.${employeeId}`,
    [employeeId]
  );
}

export function useLeaveRequestsRealtime(callback: (payload: any) => void) {
  return useRealtime('leave_requests', callback);
}

export function useAnnouncementsRealtime(callback: (payload: any) => void) {
  return useRealtime('announcements', callback);
}