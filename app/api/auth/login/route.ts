import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const body = await req.json();

  const { email, password } = body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid login" },
      { status: 401 }
    );
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return NextResponse.json(
      { error: "Invalid login" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}