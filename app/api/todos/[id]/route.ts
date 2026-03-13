import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Helper to extract and verify userId from JWT
async function getUserId(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.split(" ")[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload.userId as string;
  } catch {
    return null;
  }
}

// GET todo detail
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const todo = await prisma.todo.findUnique({ where: { id } });

  if (!todo) return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  if (todo.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json(todo);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Todo id is required" },
      { status: 400 }
    );
  }

  const existingTodo = await prisma.todo.findUnique({ where: { id } });
  if (!existingTodo) return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  if (existingTodo.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();

  const data: { content?: string; date?: Date; status?: string } = {};
  if (typeof body.content === "string") data.content = body.content;
  if (body.date != null) data.date = new Date(body.date);
  if (typeof body.status === "string") data.status = body.status;

  const todo = await prisma.todo.update({
    where: { id },
    data,
  });

  return NextResponse.json(todo);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Todo id is required" },
      { status: 400 }
    );
  }

  const existingTodo = await prisma.todo.findUnique({ where: { id } });
  if (!existingTodo) return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  if (existingTodo.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.todo.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}