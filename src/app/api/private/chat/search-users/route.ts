import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { canSendMessageTo } from '@/lib/db/queries/messages/visibilityFilters';
import { getUserIdFromRequest } from "@/lib/server/api/getUserId";
import { respondError, respondSuccess } from "@/lib/server/api/response";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const userId = await getUserIdFromRequest(request);
  
  if (!query || query.length < 2) {
    return NextResponse.json(respondSuccess({ users: [] }));
  }

  if (!userId) {
    return NextResponse.json(respondError('Unauthorized'), { status: 401 });
  }

  try {
    const users = await db.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: userId // Exclude self from search results
            }
          },
          {
            OR: [
              {
                username: {
                  contains: query,
                },
              },
              {
                firstName: {
                  contains: query,
                },
              },
              {
                lastName: {
                  contains: query,
                },
              },
              {
                email: {
                  contains: query,
                },
              },
            ],
          }
        ]
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        visibility: true,
      },
      take: 20,
    });

    // Filter users based on message visibility - only show users you can message
    const filteredUsers = [];
    for (const user of users) {
      const canMessage = await canSendMessageTo(userId, user.id);
      if (canMessage) {
        // Remove visibility from the response
        const { visibility, ...userWithoutVisibility } = user;
        filteredUsers.push(userWithoutVisibility);
      }
    }

    return NextResponse.json(respondSuccess({ users: filteredUsers }));
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json(respondError('Failed to search users'), { status: 500 });
  }
}
