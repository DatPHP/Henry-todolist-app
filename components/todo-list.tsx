"use client";

import useSWR from "swr";
import TodoItem from "./todo-item";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function TodoList({ date }: { date: string }) {
  const { data, mutate } = useSWR(
    `/api/todos?date=${date}`,
    fetcher
  );

  if (!data) return <p className="py-4 text-gray-500">Loading...</p>;

  if (data.length === 0) {
    return <p className="py-4 text-gray-500">No todo for this date</p>;
  }

  return (
    <div className="h-auto w-auto">
      {data.map((todo: { id: string; content: string; status: string }) => (
        <TodoItem key={todo.id} todo={todo} mutate={mutate} />
      ))}
    </div>
  );
}
