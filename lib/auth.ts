import { jwtVerify } from "jose";

export async function getUserIdFromRequest(req: Request) {

    const authHeader = req.headers.get("authorization");

    if (!authHeader) return null;

    const token = authHeader.replace("Bearer ", "");

    try {

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jwtVerify(
            token,
            secret
        );

        return payload.userId as string;

    } catch {
        return null;
    }
}