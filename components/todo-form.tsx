"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TodoForm({ id }: { id?: string }) {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetch(`/api/todos/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 404 ? "Todo not found" : "Failed to load");
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        setContent(data.content ?? "");
        const dateStr = data.date ? new Date(data.date).toISOString().slice(0, 10) : "";
        setDate(dateStr);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
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

  if (loading) {
    return <p className="text-gray-500">Loading todo...</p>;
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-red-600">{error}</p>
        <button
          type="button"
          className="text-blue-600 underline"
          onClick={() => router.push("/")}
        >
          Back to list
        </button>
      </div>
    );
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