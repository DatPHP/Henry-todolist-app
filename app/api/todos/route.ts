import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { todoSchema } from "@/lib/validations";

export async function GET(req: Request) {

  const userId = await getUserIdFromRequest(req);

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);

  const date = searchParams.get("date");

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const todos = await prisma.todo.findMany({
      where: {
        userId,
        ...(date && {
          date: {
            gte: start,
            lt: end
          }
        })
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(todos);
  }

  const todos = await prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(todos);
}

export async function POST(req: Request) {

  const userId = await getUserIdFromRequest(req);

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const result = todoSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const { content, date, status, priority, type } = result.data;

  const todo = await prisma.todo.create({
    data: {
      content,
      date: new Date(date),
      status,
      priority,
      type,
      userId
    },
  });

  return NextResponse.json(todo);
}