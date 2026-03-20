"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = ([url, token]: [string, string]) => fetch(url, {
  headers: { Authorization: `Bearer ${token}` }
}).then((r) => r.json());

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

  const { data } = useSWR(
    token ? ["/api/todos", token] : null,
    fetcher
  );

  const todoDates = new Set(
    Array.isArray(data) ? data.map((todo: any) => dayjs(todo.date).format("YYYY-MM-DD")) : []
  );

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
            return dayjs(arg.date).format("YYYY-MM-DD") === selectedDay.format("YYYY-MM-DD") ? "bg-blue-100" : "";
          }}
          dayCellContent={(arg) => {
            const dateStr = dayjs(arg.date).format("YYYY-MM-DD");
            const hasTodo = todoDates.has(dateStr);
            const isBirthday = birthday && dayjs(arg.date).format("MM-DD") === dayjs(birthday).format("MM-DD");

            return (
              <div className="flex flex-col items-center w-full relative">
                <span className={isBirthday ? "text-emerald-600 font-bold" : ""}>
                  {arg.dayNumberText}
                </span>
                {isBirthday && (
                  <div className="text-xs absolute -top-1 -right-2" title="Birthday!">🎂</div>
                )}
                {hasTodo && (
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-0.5" />
                )}
              </div>
            );
          }}
          headerToolbar={{
            left: "prev",
            center: "title",
            right: "next",
          }}
          height="auto"
        />
      </div>
    </>
  );
}
