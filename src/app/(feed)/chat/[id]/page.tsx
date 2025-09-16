"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Info, Phone, Video as VideoIcon } from "lucide-react";
import { ModeToggle } from "@/components/toggle-theme";
import Link from "next/link";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/hooks/use-user-data";
import { useWebRTCCall } from "@/hooks/use-webrtc-call";

interface ChatPageProps {
  chatId: string;
  onBack?: () => void;

}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [chatUser, setChatUser] = useState<any>(null);
  const { user } = useUser()
  const currentUserId = user?.id;
  useEffect(() => {
    params.then(p => setReceiverId(p.id));
  }, [params]);

  // Fetch user information for the chat header
  useEffect(() => {
    if (receiverId) {
      fetch(`/api/private/user/${receiverId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setChatUser(data.user);
          }
        })
        .catch(err => console.error('Error fetching user:', err));
    }
  }, [receiverId]);

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
                src={chatUser?.avatar || "/placeholder.svg"}
                alt={chatUser?.username || "User"}
              />
              <AvatarFallback>
                {chatUser?.firstName?.[0]?.toUpperCase() || chatUser?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {/* TODO: Add online status */}
          </div>
          <div>
            <div className="font-medium text-sm">
              {chatUser?.firstName && chatUser?.lastName
                ? `${chatUser.firstName} ${chatUser.lastName}`
                : chatUser?.username || "Utilisateur"}
            </div>
            <div className="text-xs text-[var(--textMinimal)]">
              {/* TODO: Add online status */}
              En ligne
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Audio/Video call buttons */}
          <ChatCallControls peerId={receiverId} />
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

function ChatCallControls({ peerId }: { peerId: string }) {
  const {
    localStream,
    remoteStream,
    incomingCall,
    isCalling,
    isInCall,
    callType,
    error,
    mediaBump,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
  } = useWebRTCCall({ peerId });

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream.current) {
      (localVideoRef.current as any).srcObject = localStream.current;
    }
  }, [mediaBump, isInCall, isCalling, callType]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream.current) {
      (remoteVideoRef.current as any).srcObject = remoteStream.current;
    }
  }, [mediaBump, isInCall, isCalling, callType]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        disabled={isCalling || isInCall}
        onClick={() => startCall("audio")}
        title="Appel audio"
      >
        <Phone className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={isCalling || isInCall}
        onClick={() => startCall("video")}
        title="Appel vidéo"
      >
        <VideoIcon className="w-5 h-5" />
      </Button>

      {/* Incoming call banner */}
      {incomingCall && !isInCall && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[var(--bgLevel1)] border border-[var(--detailMinimal)] shadow-lg rounded-lg p-3 flex items-center gap-3 z-50">
          <div className="text-sm">
            Appel entrant {incomingCall.media === 'video' ? 'vidéo' : 'audio'}
          </div>
          <Button size="sm" onClick={acceptCall} className="bg-green-600 hover:bg-green-700">Accepter</Button>
          <Button size="sm" variant="destructive" onClick={rejectCall}>Refuser</Button>
        </div>
      )}

      {/* Active call overlay */}
      {(isCalling || isInCall) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4">
          <div className="text-white mb-3 text-sm">
            {isCalling && !isInCall ? 'Appel en cours…' : 'En appel'}
          </div>
          {callType === 'video' ? (
            <div className="relative w-full max-w-3xl aspect-video bg-black rounded-lg overflow-hidden border border-white/10">
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <video ref={localVideoRef} autoPlay muted playsInline className="absolute bottom-3 right-3 w-40 rounded-md border border-white/20 shadow-lg" />
            </div>
          ) : (
            <div className="text-white/80 text-center mb-4">Appel audio</div>
          )}
          <div className="mt-4 flex gap-3">
            <Button variant="destructive" onClick={endCall}>Raccrocher</Button>
          </div>
          {error && <div className="text-red-400 text-xs mt-2">{error}</div>}
        </div>
      )}
    </>
  );
}
