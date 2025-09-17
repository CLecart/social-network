"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Info,
} from "lucide-react";
import { ModeToggle } from "@/components/toggle-theme";
import Link from "next/link";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useMemo, useState, useEffect } from "react";
import { useUser, useUserPublic } from "@/hooks/use-user-data";
import { useConversations } from "@/hooks/use-conversations";

interface ChatPageProps {
  chatId: string;
  onBack?: () => void;

}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { user } = useUser()
  const currentUserId = user?.id;
  useEffect(() => {
    params.then(p => setConversationId(p.id));
  }, [params]);

  // Conversations cache to resolve the other participant and presence
  const { conversations } = useConversations();
  const directConv = useMemo(
    () => conversations.find((c) => c.type === 'direct' && c.id === conversationId),
    [conversations, conversationId]
  );
  const receiverId = directConv?.user?.id || null;
  const isOnline = !!directConv?.user?.isOnline;

  // Fetch full public profile for header
  const { user: chatUser } = useUserPublic(receiverId || undefined);

  function onBack() {
    window.history.back();
  }

  if (!receiverId) {
    return (
      <div className="min-h-screen bg-[var(--bgLevel2)] flex items-center justify-center">
        <div className="text-[var(--textMinimal)]">
          Chargement...
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[var(--bgLevel2)] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-3.5 border-b border-[var(--detailMinimal)]  sticky top-0 bg-[var(--bgLevel1)] z-40">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-[var(--bgLevel2)] cursor-pointer ml-0.5"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="relative">
            <Avatar className="w-10 h-10 border-1 border-[var(--detailMinimal)]">
              <AvatarImage
                src={chatUser?.avatar || directConv?.user?.avatar || "/placeholder.svg"}
                alt={chatUser?.username || directConv?.user?.username || "User"}
              />
              <AvatarFallback>
                {chatUser?.firstName?.[0]?.toUpperCase() || chatUser?.username?.[0]?.toUpperCase() || directConv?.user?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {typeof isOnline === 'boolean' && (
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[var(--bgLevel1)] ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
            )}
          </div>
          <div>
            <div className="font-medium text-sm">
              {chatUser?.firstName && chatUser?.lastName
                ? `${chatUser.firstName} ${chatUser.lastName}`
                : chatUser?.username || directConv?.user?.displayName || directConv?.user?.username || "Utilisateur"}
            </div>
            <div className="text-xs text-[var(--textMinimal)]">
              {typeof isOnline === 'boolean' ? (isOnline ? 'En ligne' : 'Hors ligne') : ''}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link href={`/profile/${chatUser?.id || receiverId}`}>
            <Button variant="ghost" size="icon">
              <Info className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Real-time Chat Window */}
      <ChatWindow
        currentUserId={currentUserId!}
        receiverId={receiverId}
        type="direct"
      />
    </div>
  );
}
