import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { todoSchema } from "@/lib/validations";


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

  const result = todoSchema.partial().safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const updateData = { ...result.data };
  if (updateData.date) {
    (updateData as any).date = new Date(updateData.date);
  }

  const todo = await prisma.todo.update({
    where: { id },
    data: updateData,
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