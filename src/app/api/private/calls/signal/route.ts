import { NextRequest, NextResponse } from 'next/server';
import { redisdb } from '@/lib/server/websocket/redis';

type CallKind = 'offer' | 'answer' | 'ice' | 'hangup' | 'reject' | 'ring';
type MediaKind = 'audio' | 'video';

interface SignalBody {
  toUserId: string;
  kind: CallKind;
  media?: MediaKind; // for offer/ring UI hint
  sdp?: any; // SDP object or string
  candidate?: any; // ICE candidate
}

export async function POST(request: NextRequest) {
  try {
    const fromUserId = request.headers.get('x-user-id');
    if (!fromUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { toUserId, kind, media, sdp, candidate } = (await request.json()) as SignalBody;

    if (!toUserId || !kind) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const event = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
      type: 'call_signal' as const,
      kind,
      media: media || undefined,
      fromUserId,
      toUserId,
      sdp: sdp ?? undefined,
      candidate: candidate ?? undefined,
      timestamp: new Date().toISOString(),
    };

    if (kind === 'ice') {
      // For ICE candidates, store as queued unique events and let listener delete after sending
      await redisdb.set(`call_ice:${toUserId}:${fromUserId}:${event.id}`, event, { ex: 180 });
    } else {
      // Store the latest signal between this pair; short TTL is enough for pickup
      await redisdb.set(`latest:call:${fromUserId}:${toUserId}`, event, { ex: 120 });
    }

    return NextResponse.json({ success: true, event });
  } catch (err) {
    console.error('Error sending call signal:', err);
    return NextResponse.json({ error: 'Failed to send signal' }, { status: 500 });
  }
}
