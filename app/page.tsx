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
    <div className="min-h-screen todoBackground flex justify-center items-center py-8">
      <div className="w-full max-w-2xl todoContent p-4 mt-4 rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
        <main className="p-4">
          <div className="mb-4">
            <CalendarView date={date} onDateClick={setDate} />
          </div>

          <div className="space-y-4">
            {date && <TodoList date={date} />}
          </div>

          {/* AddTodoButton */}
          <div className="flex justify-end mt-6 mb-2">
           
              <Link
        href="/todos/create"
        className="border-black bg-black rounded-lg flex items-center justify-center no-underline w-[52px] h-[52px]"
        style={{ borderWidth: 12 }}
      >

     
              <div className="flex items-center justify-center bg-white rounded-full border-black">
          <svg
            fill="#000000"
            height="24px"
            width="24px"
            version="1.1"
            viewBox="0 0 330 330"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <path
              d="M315,0H15C6.716,0,0,6.716,0,15v300c0,8.284,6.716,15,15,15h300c8.284,0,15-6.716,15-15V15
        C330,6.716,323.284,0,315,0z M255,180h-75v75c0,8.284-6.716,15-15,15s-15-6.716-15-15v-75H75c-8.284,0-15-6.716-15-15
        s6.716-15,15-15h75V75c0-8.284,6.716-15,15-15s15,6.716,15,15v75h75c8.284,0,15,6.716,15,15S263.284,180,255,180z"
            />
          </svg>
        </div>
        </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
