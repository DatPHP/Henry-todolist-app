"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function CalendarView({
  date,
  onDateClick,
  birthday,
}: {
  date: string;
  onDateClick: (dateStr: string) => void;
  birthday?: string | null;
}) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const { data } = useQuery({
    queryKey: ['todos', 'all'],
    queryFn: async () => {
      const res = await fetch("/api/todos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!token,
  });

  const todoCounts = Array.isArray(data) ? data.reduce((acc: Record<string, number>, todo: any) => {
    const dateStr = dayjs(todo.date).format("YYYY-MM-DD");
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {}) : {};

  const selectedDay = date ? dayjs(date) : dayjs();
  const startOfWeek = selectedDay.startOf("week");
  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    startOfWeek.add(i, "day")
  );

  return (
    <>
      {/* DateHeader */}
      <div className="pt-4 shadow-md relative">
        <div className="flex justify-between items-center mb-4 px-2">
          <div>
            <p className="text-sm tracking-wide uppercase font-semibold text-gray-600">
              {selectedDay.format("dddd, MMM D")}
            </p>
            <h1 className="text-2xl font-bold">To-Do List</h1>
          </div>
        </div>
        {/* Week strip */}
        {/* <div className="mt-6 mb-5 flex justify-between items-center px-1">
          {daysOfWeek.map((day, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onDateClick(day.format("YYYY-MM-DD"))}
              className={`flex flex-col items-center pb-3 cursor-pointer border-0 bg-transparent ${
                selectedDay.isSame(day, "date")
                  ? "text-black border-b-4 border-black px-3"
                  : ""
              }`}
            >
              <span
                className={`text-xs font-bold ${
                  selectedDay.isSame(day, "date")
                    ? "text-black"
                    : "text-gray-300"
                }`}
              >
                {day.format("dd").charAt(0)}
              </span>
              <span
                className={`text-sm font-bold ${
                  selectedDay.isSame(day, "date")
                    ? "text-black"
                    : "text-gray-400"
                }`}
              >
                {day.format("D")}
              </span>
            </button>
          ))}
        </div> */}
      </div>

      {/* FullCalendar */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={(info) => onDateClick(info.dateStr)}
          dayCellClassNames={(arg) => {
            return dayjs(arg.date).format("YYYY-MM-DD") === selectedDay.format("YYYY-MM-DD")
              ? "bg-emerald-100 ring-2 ring-emerald-500 ring-inset"
              : "";
          }}
          dayCellContent={(arg) => {
            const dateStr = dayjs(arg.date).format("YYYY-MM-DD");
            const count = todoCounts[dateStr] || 0;
            const isBirthday = birthday && dayjs(arg.date).format("MM-DD") === dayjs(birthday).format("MM-DD");

            return (
              <div className="flex flex-col items-center w-full relative min-h-[40px] pb-1">
                <span className={isBirthday ? "text-emerald-700 font-bold" : ""}>
                  {arg.dayNumberText}
                </span>
                {isBirthday && (
                  <div className="text-[12px] absolute -top-1 -right-1 z-10" title="Birthday!">🎂</div>
                )}
                {count > 0 && (
                  <div className="flex items-center gap-1 mt-1 justify-center text-[10px] sm:text-xs text-gray-500 font-semibold px-1">
                    <span>{count}</span>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-sm" />
                  </div>
                )}
              </div>
            );
          }}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "today",
          }}
          height="auto"
        />
      </div>
    </>
  );
}
