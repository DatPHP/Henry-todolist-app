import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const date = searchParams.get("date");

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const todos = await prisma.todo.findMany({
      where: {
        date: {
          gte: start,
          lt: end,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(todos);
  }

  const todos = await prisma.todo.findMany();

  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const body = await req.json();

  const todo = await prisma.todo.create({
    data: {
      content: body.content,
      date: new Date(body.date),
      status: body.status || "not_completed",
    },
  });

  return NextResponse.json(todo);
}