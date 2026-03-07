"use client";

import { useState } from "react";
import CalendarView from "@/components/calendar-view";
import { useTodos } from "@/hooks/useTodos";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string>();

  const { todos, mutate } = useTodos(selectedDate);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      
      <h1 className="text-3xl font-bold">
        Todo Calendar
      </h1>

      {/* Calendar */}
      <div className="border rounded-lg p-4">
        <CalendarView onDateClick={(date: string) => setSelectedDate(date)} />
      </div>

      {/* Selected Date */}
      {selectedDate && (
        <div className="text-lg font-semibold">
          Todos for {selectedDate}
        </div>
      )}

      {/* Todo List */}
      <div className="space-y-2">
        {todos?.length === 0 && (
          <p className="text-gray-500">
            No todo for this day
          </p>
        )}

        {todos?.map((todo: any) => (
          <div
            key={todo.id}
            className="flex items-center justify-between border p-3 rounded"
          >
            <div>
              <p className="font-medium">
                {todo.content}
              </p>

              <p className="text-sm text-gray-500">
                Status: {todo.status}
              </p>
            </div>

            <div className="space-x-2">
              <button
                className="text-blue-600"
                onClick={async () => {
                  await fetch(`/api/todos/${todo.id}`, {
                    method: "PUT",
                    body: JSON.stringify({
                      status:
                        todo.status === "completed"
                          ? "not_completed"
                          : "completed",
                    }),
                  });

                  mutate();
                }}
              >
                Toggle
              </button>

              <button
                className="text-red-600"
                onClick={async () => {
                  await fetch(`/api/todos/${todo.id}`, {
                    method: "DELETE",
                  });

                  mutate();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}