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
    const url = new URL(request.url);
    const senderId = url.searchParams.get('senderId');
    const unreadOnly = url.searchParams.get('unreadOnly') === 'true';

    if (!senderId) {
      return NextResponse.json(respondError('senderId is required'), { status: 400 });
    }

    const whereClause: any = {
      senderId: senderId,
      receiverId: userId
    };

    if (unreadOnly) {
      whereClause.status = {
        in: ['SENT', 'DELIVERED'] // Not read yet
      };
    }

    const messages = await db.message.findMany({
      where: whereClause,
      select: {
        id: true,
        message: true,
        status: true,
        datetime: true,
        readAt: true
      },
      orderBy: {
        datetime: 'desc'
      }
    });

    return NextResponse.json(respondSuccess({ messages }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(respondError('Failed to fetch messages'), { status: 500 });
  }
}
