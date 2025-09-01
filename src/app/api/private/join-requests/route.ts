import { NextRequest, NextResponse } from 'next/server';
import { getJoinRequestsForOwner } from '@/lib/db/queries/groups/getJoinRequests';
import { respondError } from '@/lib/server/api/response';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all pending join requests for groups owned by the current user
    const joinRequests = await getJoinRequestsForOwner(userId);

    return NextResponse.json({
      joinRequests: joinRequests.map(request => ({
        id: request.id,
        groupId: request.groupId,
        group: request.Conversation,
        seeker: request.User,
        status: request.status,
        createdAt: request.createdAt.toISOString()
      }))
    });
  } catch (error) {
    console.error('Error fetching join requests:', error);
    return NextResponse.json(
      respondError(error instanceof Error ? error.message : 'Failed to fetch join requests'), 
      { status: 500 }
    );
  }
}
