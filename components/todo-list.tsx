"use client";

import useSWR from "swr";
import TodoItem from "./todo-item";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function TodoList({ date }: { date: string }) {

  const { data, mutate } = useSWR(
    `/api/todos?date=${date}`,
    fetcher
  );

  if (!data) return <p>Loading...</p>;

  if (data.length === 0) {
    return <p>No todo for this date</p>;
  }

  return (
    <div className="space-y-2">
      {data.map((todo: any) => (
        <TodoItem key={todo.id} todo={todo} mutate={mutate} />
      ))}
    </div>
  );
}