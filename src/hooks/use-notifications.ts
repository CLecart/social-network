'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/client/api/fetcher';

interface NotificationCounts {
  invitations: number;
  unreadMessages: number;
  upcomingEvents: number;
}

export function useNotifications() {
  const [counts, setCounts] = useState<NotificationCounts>({
    invitations: 0,
    unreadMessages: 0,
    upcomingEvents: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadNotificationCounts = async () => {
    try {
      setIsLoading(true);
      
      // Load group invitation counts
      const invitationsRes = await apiFetch<any>('/api/private/invitations');
      const invitationsData = (invitationsRes as any)?.data;
      const groupInvitationCount = invitationsData?.invitations?.length || 0;

      // Load friend request counts
      const friendReqRes = await apiFetch<any>('/api/private/friend-requests');
      const friendRequestsData = (friendReqRes as any)?.data;
      const friendRequestCount = friendRequestsData?.friendRequests?.length || 0;

      // Total invitations = group invitations + friend requests
      const totalInvitations = groupInvitationCount + friendRequestCount;

      // Load unread messages count
      const messagesRes = await apiFetch<any>('/api/private/notifications/unread-messages');
      const messagesData = (messagesRes as any)?.data;
      const unreadMessagesCount = messagesData?.count || 0;

      // Load upcoming events count (events in next 7 days)
      const eventsRes = await apiFetch<any>('/api/private/notifications/upcoming-events');
      const eventsData = (eventsRes as any)?.data;
      const upcomingEventsCount = eventsData?.count || 0;

      setCounts({
        invitations: totalInvitations,
        unreadMessages: unreadMessagesCount,
        upcomingEvents: upcomingEventsCount
      });
    } catch (error) {
      console.error('Error loading notification counts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotificationCounts();
    
    // Rafraîchir les notifications toutes les 30 secondes
    const interval = setInterval(loadNotificationCounts, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const markInvitationsAsRead = () => {
    setCounts(prev => ({ ...prev, invitations: 0 }));
  };

  const markMessagesAsRead = () => {
    setCounts(prev => ({ ...prev, unreadMessages: 0 }));
  };

  const markEventsAsRead = () => {
    setCounts(prev => ({ ...prev, upcomingEvents: 0 }));
  };

  const refreshCounts = () => {
    loadNotificationCounts();
  };

  return {
    counts,
    isLoading,
    markInvitationsAsRead,
    markMessagesAsRead,
    markEventsAsRead,
    refreshCounts
  };
}
