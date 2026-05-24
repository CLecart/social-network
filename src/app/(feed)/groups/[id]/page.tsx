'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, MessageCircle, Calendar, Plus, Settings, UserPlus, Trash2, LogOut } from 'lucide-react';
import { CreateEventModal } from '@/components/events/CreateEventModal';
import { EventCard } from '@/components/events/EventCard';
import { InviteUserModal } from '@/components/groups/InviteUserModal';
import Link from 'next/link';
import { useUser } from '@/hooks/use-user-data';
import { useGroup } from '@/hooks/use-group';
import { useGroupEvents } from '@/hooks/use-group-events';
import { apiFetch } from '@/lib/client/api/fetcher';
import type { GroupMember } from '@/lib/schemas/group/summary';
import type { GroupEvent } from '@/lib/schemas/group/event';

// Types are provided by schemas

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  const { user: me } = useUser();
  const currentUserId = me?.id || '';
  const { data: group, refresh: refreshGroup } = useGroup(groupId);
  const { data: eventsResp, isLoading: isLoadingEvents, refresh: refreshEvents } = useGroupEvents(groupId);
  const [events, setEvents] = useState<GroupEvent[]>([]);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    setEvents(eventsResp?.events ?? []);
  }, [eventsResp]);

  const handleEventCreated = (newEvent: GroupEvent) => {
    setEvents(prev => [newEvent, ...prev]);
  };

  const handleRsvpUpdate = (eventId: string, status: 'YES' | 'NO' | 'MAYBE' | null) => {
    setEvents(prevEvents =>
      prevEvents.map(event => {
        if (event.id === eventId) {
          const updatedCounts = { ...event.rsvpCounts };

          if (event.userRsvp) {
            const prevStatus = event.userRsvp.toLowerCase() as 'yes' | 'no' | 'maybe';
            updatedCounts[prevStatus] = Math.max(0, updatedCounts[prevStatus] - 1);
          }

          if (status) {
            const newStatus = status.toLowerCase() as 'yes' | 'no' | 'maybe';
            updatedCounts[newStatus] = updatedCounts[newStatus] + 1;
          }

          return {
            ...event,
            userRsvp: status,
            rsvpCounts: updatedCounts
          };
        }
        return event;
      })
    );
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }

    try {
      await apiFetch(`/api/private/events/${eventId}`, { method: 'DELETE' });
      {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Erreur lors de la suppression de l\'événement');
    }
  };

  const handleInviteSent = () => {
    // Refresh group data to show updated member count
    refreshGroup();
  };

  const handleDeleteGroup = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible et supprimera tous les messages, événements et données associés.')) {
      return;
    }

    try {
      await apiFetch(`/api/private/groups/${groupId}`, { method: 'DELETE' });
      router.push('/groups');
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Erreur lors de la suppression du groupe');
    }
  };

  const handleLeaveGroup = async () => {
    if (!confirm('Êtes-vous sûr de vouloir quitter ce groupe ?')) {
      return;
    }

    try {
      await apiFetch(`/api/private/groups/${groupId}/leave`, { method: 'POST' });
      router.push('/groups');
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('Erreur lors de la sortie du groupe');
    }
  };

  const getUserDisplayName = (user: GroupMember) => {
    return user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username;
  };

  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.datetime) > now);
  const pastEvents = events.filter(event => new Date(event.datetime) <= now);

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Chargement du groupe...</div>
        </div>
      </div>
    );
  }

  const isOwner = group?.owner?.id === currentUserId;
  const isMember = group?.members?.some(member => member.id === currentUserId);

  return (
    <div className="container mx-auto px-4 py-8 bg-[var(--bgLevel1)]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{group.title}</h1>
          <p className="text-gray-600 mt-1">
            {group.memberCount} membre{group.memberCount > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">

          <Link href={`/chat?group=${groupId}`}>
            <Button variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </Link>
          {isMember && (
            <>
              <Button
                onClick={() => setIsCreateEventModalOpen(true)}
                className="bg-[var(--blue40)] hover:bg-[var(--blue60)] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer un événement
              </Button>
              {!isOwner && (
                <Button
                  onClick={handleLeaveGroup}
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Quitter le groupe
                </Button>
              )}
            </>
          )}

          <Button
            variant="outline"
            onClick={() => setIsInviteModalOpen(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Inviter
          </Button>
          {isOwner && (
            <>


              <Button
                onClick={handleDeleteGroup}
                variant="destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer le groupe
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Événements ({events.length})
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Membres ({group.memberCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          {/* Events Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <Card className='bg-[var(--bgLevel2)]'>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Événements à venir</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingEvents.length}</div>
              </CardContent>
            </Card>
            <Card className='bg-[var(--bgLevel2)]'>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Événements passés</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pastEvents.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Events List */}
          {isLoadingEvents ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Chargement des événements...</div>
            </div>
          ) : events.length === 0 ? (
            <Card className="text-center py-12 bg-[var(--bgLevel2)]">
              <CardContent>
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun événement</h3>
                <p className="text-gray-600 mb-6">
                  Soyez le premier à créer un événement pour ce groupe !
                </p>
                {isMember && (
                  <Button
                    onClick={() => setIsCreateEventModalOpen(true)}
                    className="bg-[var(--blue40)] hover:bg-[var(--blue60)] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer le premier événement
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {upcomingEvents.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">À venir</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {upcomingEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        currentUserId={currentUserId}
                        onRsvpUpdate={handleRsvpUpdate}
                        onDelete={event.owner.id === currentUserId ? handleDeleteEvent : undefined}
                      />
                    ))}
                  </div>
                </div>
              )}

              {pastEvents.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Passés</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {pastEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        currentUserId={currentUserId}
                        onRsvpUpdate={handleRsvpUpdate}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="members" className="space-y-6 ">
          <div className="grid gap-4">
            {group?.members?.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.firstName?.[0] || member.username?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">
                        {getUserDisplayName(member)}
                      </div>
                      <div className="text-sm text-gray-500">@{member.username}</div>
                    </div>
                    {member.id === group?.owner?.id && (
                      <Badge variant="secondary">Propriétaire</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        onEventCreated={handleEventCreated}
        groupId={groupId}
        groupTitle={group?.title}
      />

      {/* Invite User Modal */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        groupId={groupId}
        groupTitle={group?.title}
        onInviteSent={handleInviteSent}
      />
    </div>
  );
}
