"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import TodoItem from "./todo-item";

const fetcher = ([url, token]: [string, string]) => fetch(url, {
  headers: { Authorization: `Bearer ${token}` }
}).then((r) => r.json());

export default function TodoList({ date }: { date: string }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const { data, mutate } = useSWR(
    token ? [`/api/todos?date=${date}`, token] : null,
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
