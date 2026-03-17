import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const { email, newPassword } = await req.json();

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {

        return NextResponse.json({
            success: false,
            message: "User not found"
        });

    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { email },
        data: { password: hashed }
    });

    return NextResponse.json({
        success: true
    });

}