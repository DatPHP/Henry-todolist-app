import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: any) {
  const body = await req.json();

  const todo = await prisma.todo.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json(todo);
}

export async function DELETE(req: Request, { params }: any) {
  await prisma.todo.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}