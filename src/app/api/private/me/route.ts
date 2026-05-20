import { uploadIfFile } from "@/lib/cloudinary/uploadFile";
import { UserPrivate, UserSchemas } from "@/lib/schemas/user";
import { getUserByIdServer } from "@/lib/server/user/getUser";
import { updateUserServer } from "@/lib/server/user/updateServerUser";
import { NextRequest, NextResponse } from "next/server";
import { respondSuccess, respondError } from "@/lib/server/api/response";
import { ValidationError } from "@/lib/utils/validation";
import { getUserIdFromRequest } from "@/lib/server/api/getUserId";
import { db } from "@/lib/db";


export async function GET(req: NextRequest) {
    try {
        const userId = await getUserIdFromRequest(req);


        if (!userId) {
            return NextResponse.json(respondError("Invalid user ID"), { status: 401 });
        }

        const userData = await getUserByIdServer<UserPrivate>(userId, UserSchemas.Private);

        if (!userData) {
            return NextResponse.json(respondError("User not found."), { status: 404 });
        }

        return NextResponse.json(respondSuccess(userData));


    } catch (err) {
        console.error("Failed to fetch user info:", err);

        return NextResponse.json(
            respondError(err instanceof Error ? err.message : "Unexpected error"),
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
        return NextResponse.json(respondError("Invalid user ID"), { status: 401 });
    }

    const formData = await req.formData();
    const data: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
        if (typeof value === "string") {
            data[key] = value;
        }
    }

    try {
        const coverUpload = await uploadIfFile(formData.get("cover"), `users/${userId}`);
        if (coverUpload) {
            data.cover = coverUpload.url;
            data.coverId = coverUpload.id;
        }

        const bannerUpload = await uploadIfFile(formData.get("banner"), `users/${userId}`);
        if (bannerUpload) {
            data.banner = bannerUpload.url;
            data.bannerId = bannerUpload.id;
        }

        await updateUserServer(userId, data);

        return NextResponse.json(respondSuccess(null, "User updated successfully"));
    } catch (err) {
        if (err instanceof ValidationError) {
            return NextResponse.json(
                respondError("Validation error", err.fieldErrors),
                { status: 400 }
            );
        }

        return NextResponse.json(
            respondError(err instanceof Error ? err.message : "Unexpected error"),
            { status: 500 }
        );
    }
}

// RGPD — Droit à l'oubli (Art. 17 RGPD) : suppression complète du compte et de toutes les données associées
export async function DELETE(req: NextRequest) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
        return NextResponse.json(respondError("Non authentifié"), { status: 401 });
    }

    try {
        // Suppression en cascade via les contraintes Prisma (onDelete: Cascade sur toutes les relations User)
        await db.user.delete({ where: { id: userId } });

        const res = NextResponse.json(respondSuccess(null, "Compte supprimé définitivement"));
        res.cookies.delete("authToken");
        return res;
    } catch (err) {
        console.error("Account deletion error:", err);
        return NextResponse.json(
            respondError(err instanceof Error ? err.message : "Erreur lors de la suppression"),
            { status: 500 }
        );
    }
}
