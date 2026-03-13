import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const body = await req.json();

  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const exist = await prisma.user.findUnique({
    where: { email },
  });

  if (exist) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      id: randomUUID(),
      name,
      email,
      password: hashed,
    },
  });

  return NextResponse.json({
    message: "Register success",
  });
}