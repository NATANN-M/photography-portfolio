import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./jwt";

export function getUserFromRequest(req: NextRequest) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];

    if (!token) return null;

    const decoded = verifyToken(token);

    return decoded;
}

export function requireAuth(req: NextRequest) {
    const user = getUserFromRequest(req);

    if (!user) {
        return {
            error: NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            ),
            user: null,
        };
    }

    return { error: null, user };
}