"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type MediaKind = "audio" | "video";

interface IncomingCallInfo {
  fromUserId: string;
  media: MediaKind;
  sdp: any;
}

const defaultIceServers: RTCIceServer[] = [
  { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
];

export function useWebRTCCall({ peerId }: { peerId: string }) {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const pendingOfferRef = useRef<any | null>(null);

  const [incomingCall, setIncomingCall] = useState<IncomingCallInfo | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState<MediaKind | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mediaBump, setMediaBump] = useState(0);

  const setupPeer = useCallback((onCandidate?: (c: RTCIceCandidate) => void) => {
    const pc = new RTCPeerConnection({ iceServers: defaultIceServers });
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        onCandidate?.(e.candidate);
      }
    };
    pc.ontrack = (e) => {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
      }
      // Prefer the first stream if provided, else add tracks
      if (e.streams && e.streams[0]) {
        remoteStreamRef.current = e.streams[0];
      } else if (e.track) {
        remoteStreamRef.current.addTrack(e.track);
      }
      // trigger re-render for UI to attach stream
      setMediaBump((x) => x + 1);
    };
    pcRef.current = pc;
    return pc;
  }, []);

  const sendSignal = useCallback(async (payload: any) => {
    try {
      await fetch("/api/private/calls/signal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: peerId, ...payload }),
      });
    } catch (e) {
      console.error("sendSignal error", e);
    }
  }, [peerId]);

  const startCall = useCallback(
    async (media: MediaKind) => {
      try {
        setError(null);
        setIsCalling(true);
        setCallType(media);

        const constraints: MediaStreamConstraints = {
          audio: true,
          video: media === "video",
        };
        const local = await navigator.mediaDevices.getUserMedia(constraints);
        localStreamRef.current = local;

        const pc = setupPeer(async (c) => {
          await sendSignal({ kind: "ice", candidate: c });
        });
        local.getTracks().forEach((t) => pc.addTrack(t, local));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await sendSignal({ kind: "offer", media, sdp: offer });
      } catch (e: any) {
        console.error("startCall error", e);
        setError(e?.message || "Failed to start call");
        setIsCalling(false);
      }
    },
    [sendSignal, setupPeer]
  );

  const acceptCall = useCallback(async () => {
    try {
      if (!incomingCall || !pendingOfferRef.current) return;
      setError(null);
      const media = incomingCall.media;
      setCallType(media);

      const constraints: MediaStreamConstraints = {
        audio: true,
        video: media === "video",
      };
      const local = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = local;

      const pc = setupPeer(async (c) => {
        await sendSignal({ kind: "ice", candidate: c });
      });
      local.getTracks().forEach((t) => pc.addTrack(t, local));

      await pc.setRemoteDescription(new RTCSessionDescription(pendingOfferRef.current));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await sendSignal({ kind: "answer", sdp: answer });

      setIncomingCall(null);
      setIsInCall(true);
      setIsCalling(false);
    } catch (e: any) {
      console.error("acceptCall error", e);
      setError(e?.message || "Failed to accept call");
    }
  }, [incomingCall, sendSignal, setupPeer]);

  const rejectCall = useCallback(async () => {
    if (!incomingCall) return;
    await sendSignal({ kind: "reject" });
    setIncomingCall(null);
    pendingOfferRef.current = null;
  }, [incomingCall, sendSignal]);

  const cleanup = useCallback(() => {
    try {
      pcRef.current?.getSenders().forEach((s) => {
        try { s.track?.stop(); } catch { /* ignore */ }
      });
      pcRef.current?.close();
    } catch { /* ignore */ }
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    remoteStreamRef.current = null;
    setIsCalling(false);
    setIsInCall(false);
    setCallType(null);
  }, []);

  const endCall = useCallback(async () => {
    await sendSignal({ kind: "hangup" });
    cleanup();
  }, [cleanup, sendSignal]);

  // Listen for signaling events
  useEffect(() => {
    if (!peerId) return;
    const es = new EventSource(`/api/private/calls/listen?peerId=${encodeURIComponent(peerId)}`);
    eventSourceRef.current = es;
    es.onmessage = async (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (data.type === 'connected') return;
        switch (data.kind) {
          case 'offer': {
            pendingOfferRef.current = data.sdp;
            setIncomingCall({ fromUserId: data.fromUserId, media: data.media || 'audio', sdp: data.sdp });
            break;
          }
          case 'answer': {
            if (pcRef.current && data.sdp) {
              await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
              setIsInCall(true);
              setIsCalling(false);
            }
            break;
          }
          case 'ice': {
            if (pcRef.current && data.candidate) {
              try {
                await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
              } catch (e) {
                console.warn('Failed to add ICE candidate', e);
              }
            }
            break;
          }
          case 'hangup': {
            cleanup();
            break;
          }
          case 'reject': {
            setIsCalling(false);
            // Keep streams closed if any
            cleanup();
            break;
          }
        }
      } catch (e) {
        console.error('Error processing signaling message', e);
      }
    };
    es.onerror = () => {
      // Let the browser reconnect automatically
    };
    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [peerId, cleanup]);

  return {
    // media
    localStream: localStreamRef,
    remoteStream: remoteStreamRef,
    // state
    incomingCall,
    isCalling,
    isInCall,
    callType,
    error,
    mediaBump,
    // actions
    startCall,
    acceptCall,
    rejectCall,
    endCall,
  } as const;
}
