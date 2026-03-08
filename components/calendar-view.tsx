"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";

export default function CalendarView({
  date,
  onDateClick,
}: {
  date: string;
  onDateClick: (dateStr: string) => void;
}) {
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
