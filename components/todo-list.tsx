"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TodoItem from "./todo-item";

export default function TodoList({ date }: { date: string }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const { data } = useQuery({
    queryKey: ['todos', date],
    queryFn: async () => {
      const res = await fetch(`/api/todos?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!token,
  });

  if (!data) return <p className="py-4 text-gray-500">Loading...</p>;

  if (data.length === 0) {
    return <p className="py-4 text-gray-500">No todo for this date</p>;
  }

  return (
    <div className="h-auto w-auto">
      {data.map((todo: { id: string; content: string; status: string }) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
