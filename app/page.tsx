"use client";

import { useState } from "react";
import CalendarView from "@/components/calendar-view";
import TodoList from "@/components/todo-list";
import Link from "next/link";

export default function Home() {
  const [date, setDate] = useState<string>(
    () => new Date().toISOString().slice(0, 10)
  );

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Todo Calendar</h1>

        <Link
          href="/todos/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Todo
        </Link>
      </div>

      <CalendarView onDateClick={setDate} />

      {date && <TodoList date={date} />}
    </main>
  );
}