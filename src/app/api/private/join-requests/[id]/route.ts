import { NextRequest, NextResponse } from 'next/server';
import { respondJoinRequest, ActionType } from '@/lib/db/queries/groups/respondRequest';
import { respondError } from '@/lib/server/api/response';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestId } = await params;
    const userId = req.headers.get('x-user-id');
    const body = await req.json();
    const { action, groupId } = body;

    if (!requestId || !userId || !action || !groupId) {
      return NextResponse.json(
        respondError('Missing required parameters'),
        { status: 400 }
      );
    }

    if (!['ACCEPT', 'REJECT'].includes(action)) {
      return NextResponse.json(
        respondError('Invalid action. Must be ACCEPT or REJECT'),
        { status: 400 }
      );
    }

    const data = {
      userId,
      groupId,
      requestId,
      action: action as ActionType,
    };

    const result = await respondJoinRequest(data);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error responding to join request:', error);
    return NextResponse.json(
      respondError(error instanceof Error ? error.message : 'Unexpected error'),
      { status: 500 }
    );
  }
}
