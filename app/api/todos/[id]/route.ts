import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
    params: { id: string };
  }
  
export async function PUT(req: Request, { params }: any) {
  const body = await req.json();

  const todo = await prisma.todo.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json(todo);
}

export async function DELETE(req: Request, { params }: Params) {
    if (!params?.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
  
    try {
      await prisma.todo.delete({
        where: { id: params.id },
      });
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json(
        { error: "Delete failed" },
        { status: 500 }
      );
    }
  }