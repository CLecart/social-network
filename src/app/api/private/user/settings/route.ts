import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { getUserIdFromRequest } from "@/lib/server/api/getUserId";
import { respondError, respondSuccess } from "@/lib/server/api/response";

const UpdateUserSettingsSchema = z.object({
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
});

export async function PATCH(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json(respondError("Unauthorized"), { status: 401 });

  try {
    const body = await req.json();
    const validatedData = UpdateUserSettingsSchema.parse(body);

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: validatedData,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        visibility: true,
      },
    });

    return NextResponse.json(respondSuccess(updatedUser, "Settings updated successfully"), { status: 200 });

  } catch (error) {
    console.error("Error updating user settings:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(respondError("Invalid request data"), { status: 400 });
    }

    return NextResponse.json(respondError("Internal server error"), { status: 500 });
  }
}
