import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(req: Request) {

  const userId = getUserIdFromRequest(req);

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

  const todos = await prisma.todo.findMany();

  return NextResponse.json(todos);
}

export async function POST(req: Request) {

  const userId = getUserIdFromRequest(req);

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const todo = await prisma.todo.create({
    data: {
      content: body.content,
      date: new Date(body.date),
      status: body.status || "not_completed",
      userId
    },
  });

  return NextResponse.json(todo);
}