"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TodoForm({ id }: any) {

  const router = useRouter();

  const [content, setContent] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!id) return;

    fetch(`/api/todos/${id}`)
      .then(r => r.json())
      .then(data => {
        setContent(data.content);
        setDate(data.date.slice(0,10));
      });

  }, [id]);

  async function handleSubmit(e: any) {
    e.preventDefault();

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/todos/${id}` : "/api/todos";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        date,
      }),
    });

    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        className="border p-2 w-full"
        placeholder="Todo content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <input
        type="date"
        className="border p-2 w-full"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>

    </form>
  );
}