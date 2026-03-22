"use client";

import { useState, useEffect, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import CalendarView from "@/components/calendar-view";
import TodoList from "@/components/todo-list";
import LogoutButton from "@/components/logout-button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function MainContent() {

  //  Check login ? not login to go homepage 
  const router = useRouter()
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const { data: user } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Not authorized");
      return res.json();
    },
    enabled: !!token,
  });

  // show date and set value 
  const [date, setDate] = useState<string>(() =>
    dateParam || new Date().toISOString().slice(0, 10),
  );

  useEffect(() => {
    if (dateParam) {
      setDate(dateParam);
    }
  }, [dateParam]);

  // logout 
  // (Moved to LogoutButton)

  return (
    <div className="min-h-screen todoBackground flex flex-col justify-center items-center py-10 px-4">
      <div className="w-full max-w-[450px]">
        <LogoutButton className="mb-6" />
      </div>
      <div className="w-full max-w-[450px] todoContent padding-4 rounded-2xl border border-gray-200 shadow-lg">
        <main className="p-4">
          <div className="mb-4">
            <CalendarView date={date} onDateClick={setDate} birthday={user?.birthday} />
          </div>

          <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl mb-6">
            <h4 className="text-emerald-500 font-semibold mb-1">Productivity Tip</h4>
            <p className="text-sm text-zinc-400">Focus on your most important task first thing in the morning for maximum efficiency.</p>
          </div>
          <div className="space-y-4">{date && <TodoList date={date} />}</div>
          {/* AddTodoButton */}
          <div className="flex justify-end mt-6 mb-2">
            <Link
              href={`/todos/create?date=${date}`}
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

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen todoBackground flex justify-center items-center">Loading...</div>}>
      <MainContent />
    </Suspense>
  );
}
