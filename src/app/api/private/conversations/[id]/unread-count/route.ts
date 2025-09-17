import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserIdFromRequest } from "@/lib/server/api/getUserId";
import { respondError, respondSuccess } from "@/lib/server/api/response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserIdFromRequest(request);
  
  if (!userId) {
    return NextResponse.json(respondError('Unauthorized'), { status: 401 });
  }

  try {
    const { id: conversationId } = await params;

    // Check if user is a member of this conversation
    const member = await db.conversationMember.findFirst({
      where: {
        userId: userId,
        conversationId: conversationId
      }
    });

    if (!member) {
      return NextResponse.json(respondSuccess({ count: 0 }));
    }

    let unreadCount = 0;

    if (member.lastSeenMessageId) {
      // Count messages sent after the last seen message
      unreadCount = await db.groupMessage.count({
        where: {
          conversationId: conversationId,
          senderId: {
            not: userId // Not from current user
          },
          sentAt: {
            gt: member.lastSeenAt || new Date(0) // Messages after last seen time
          }
        }
      });
    } else {
      // If no last seen message, count all messages from others
      unreadCount = await db.groupMessage.count({
        where: {
          conversationId: conversationId,
          senderId: {
            not: userId // Not from current user
          }
        }
      });
    }

    return NextResponse.json(respondSuccess({ count: unreadCount }));
  } catch (error) {
    console.error('Error counting unread messages:', error);
    return NextResponse.json(respondError('Failed to count unread messages'), { status: 500 });
  }
}
