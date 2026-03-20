import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";


// GET todo detail
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const userId = await getUserIdFromRequest(_req);

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const todo = await prisma.todo.findUnique({ where: { id } });

  if (!todo) return NextResponse.json({ error: "Todo not found" }, { status: 404 });

  return NextResponse.json(todo);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const userId = await getUserIdFromRequest(req);

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }


  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Todo id is required" },
      { status: 400 }
    );
  }

  const body = await req.json();

  const data: { content?: string; date?: Date; status?: string; priority?: string; type?: string } = {};
  if (typeof body.content === "string") data.content = body.content;
  if (body.date != null) data.date = new Date(body.date);
  if (typeof body.status === "string") data.status = body.status;
  if (typeof body.priority === "string") data.priority = body.priority;
  if (typeof body.type === "string") data.type = body.type;

  const todo = await prisma.todo.update({
    where: { id },
    data,
  });

  return NextResponse.json(todo);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const userId = await getUserIdFromRequest(_req);

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Todo id is required" },
      { status: 400 }
    );
  }

  await prisma.todo.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}