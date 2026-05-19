import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { redisdb } from "@/lib/server/websocket/redis";
import { getUserIdFromRequest } from "@/lib/server/api/getUserId";
import { respondError, respondSuccess } from "@/lib/server/api/response";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json(respondError("Unauthorized"), { status: 401 });
  }

  try {
    const { id: messageId } = await params;
    const { status } = await request.json();

    if (!status || !["DELIVERED", "READ"].includes(status)) {
      return NextResponse.json(
        respondError("Invalid status. Must be DELIVERED or READ"),
        { status: 400 },
      );
    }

    // Get the message to check permissions
    const message = await db.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return NextResponse.json(respondError("Message not found"), {
        status: 404,
      });
    }

    // Check if user is the receiver and not the sender
    if (message.receiverId !== userId) {
      return NextResponse.json(
        respondError("Cannot update status for this message"),
        { status: 403 },
      );
    }

    // Update message status
    const updateData: any = {
      status: status as "DELIVERED" | "READ",
    };

    if (status === "DELIVERED" && !message.deliveredAt) {
      updateData.deliveredAt = new Date();
    } else if (status === "READ") {
      updateData.readAt = new Date();
      if (!message.deliveredAt) {
        updateData.deliveredAt = new Date();
        updateData.status = "READ"; // Skip delivered, go straight to read
      }
    }

    const updatedMessage = await db.message.update({
      where: { id: messageId },
      data: updateData,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    // Notify sender via SSE polling update
    const statusUpdate = {
      type: "message_status_update",
      messageId: messageId,
      status: updatedMessage.status,
      deliveredAt: updatedMessage.deliveredAt?.toISOString(),
      readAt: updatedMessage.readAt?.toISOString(),
      conversationId: message.receiverId, // For direct messages, use receiverId as conversationId for SSE polling routing
      timestamp: new Date().toISOString(),
    };

    // Send status update to the message sender with unique key
    const statusKey = `status_update:${message.senderId}:${messageId}:${Date.now()}`;
    await redisdb.set(statusKey, statusUpdate, { ex: 300 }); // 5 minutes TTL

    return NextResponse.json(
      respondSuccess({
        id: updatedMessage.id,
        status: updatedMessage.status,
        deliveredAt: updatedMessage.deliveredAt?.toISOString(),
        readAt: updatedMessage.readAt?.toISOString(),
      }),
    );
  } catch (error) {
    console.error("Error updating direct message status:", error);
    return NextResponse.json(respondError("Failed to update message status"), {
      status: 500,
    });
  }
}
