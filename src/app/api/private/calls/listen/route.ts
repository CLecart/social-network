import { NextRequest } from 'next/server';
import { redisdb } from '@/lib/server/websocket/redis';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const peerId = searchParams.get('peerId');
  if (!peerId) {
    return new Response('peerId is required', { status: 400 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`));

      let isActive = true;
      let lastEventId = '';

      const poll = async () => {
        while (isActive) {
          try {
            const channels = [
              `latest:call:${userId}:${peerId}`,
              `latest:call:${peerId}:${userId}`,
            ];
            for (const key of channels) {
              const data = await redisdb.get(key);
              if (data && typeof data === 'object' && 'id' in data) {
                const evt = data as any;
                // Only deliver events intended for this user
                if (evt.id !== lastEventId && evt.toUserId === userId) {
                  lastEventId = evt.id;
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(evt)}\n\n`));
                }
              }
            }

            // Drain queued ICE candidates destined to this user
            const iceKeys = await redisdb.keys(`call_ice:${userId}:${peerId}:*`);
            for (const k of iceKeys) {
              const iceEvt = await redisdb.get(k);
              if (iceEvt && typeof iceEvt === 'object') {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(iceEvt)}\n\n`));
                await redisdb.del(k);
              }
            }
          } catch (e) {
            console.error('Error polling call signals:', e);
          }
          await new Promise((r) => setTimeout(r, 500));
        }
      };

      poll();

      request.signal.addEventListener('abort', () => {
        isActive = false;
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
