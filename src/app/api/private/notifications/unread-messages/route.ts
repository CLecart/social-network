import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserIdFromRequest } from "@/lib/server/api/getUserId";
import { respondError, respondSuccess } from "@/lib/server/api/response";

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  
  if (!userId) {
    return NextResponse.json(respondError('Unauthorized'), { status: 401 });
  }

  try {
    // Get all conversations where user is a member with their last seen info
    const userConversations = await db.conversationMember.findMany({
      where: {
        userId: userId
      },
      select: {
        conversationId: true,
        lastSeenMessageId: true,
        lastSeenAt: true
      }
    });

    if (userConversations.length === 0) {
      return NextResponse.json(respondSuccess({ count: 0 }));
    }

    let totalUnreadCount = 0;

    for (const conversation of userConversations) {
      let unreadCount = 0;

      if (conversation.lastSeenMessageId) {
        // Count messages sent after the last seen message
        unreadCount = await db.groupMessage.count({
          where: {
            conversationId: conversation.conversationId,
            senderId: {
              not: userId // Not from current user
            },
            sentAt: {
              gt: conversation.lastSeenAt || new Date(0) // Messages after last seen time
            }
          }
        });
      } else {
        // If no last seen message, count all messages from others
        unreadCount = await db.groupMessage.count({
          where: {
            conversationId: conversation.conversationId,
            senderId: {
              not: userId // Not from current user
            }
          }
        });
      }

      totalUnreadCount += unreadCount;
    }

    return NextResponse.json(respondSuccess({ count: totalUnreadCount }));
  } catch (error) {
    console.error('Error counting unread messages:', error);
    return NextResponse.json(respondError('Failed to count unread messages'), { status: 500 });
  }
}
