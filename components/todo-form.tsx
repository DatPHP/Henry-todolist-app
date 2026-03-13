"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function TodoForm({ id }: { id?: string }) {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("not_completed");
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      // Set to local today's date
      const today = new Date();
      const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      setDate(localToday);
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetch(`/api/todos/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 404 ? "Todo not found" : "Failed to load");
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        setContent(data.content ?? "");
        const dateStr = data.date ? new Date(data.date).toISOString().slice(0, 10) : "";
        setDate(dateStr);
        setStatus(data.status ?? "not_completed");
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
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        content,
        date,
        status,
      }),
    });

    router.push("/");
  }

  const handleCancel = () => {
    router.push("/");
  };

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
          onClick={handleCancel}
        >
          Back to list
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-4 px-6">
        <Button
          variant="text"
          className="cancelBtn !font-bold !capitalize"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          variant="text"
          className="!text-gray-900 !font-bold !capitalize"
          type="submit"
        >
          {id ? "Update task" : "Add task"}
        </Button>
      </div>
      <TextField
        variant="standard"
        placeholder="Write your task"
        fullWidth
        multiline
        minRows={1}
        className="todoInput !px-6"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        InputProps={{
          disableUnderline: true,
          sx: { fontSize: "26px" },
        }}
      />

      {/* Options */}
      <div className="divide-y divide-gray-200">
        <div className="flex justify-between items-center py-4 px-6">
          <span className="titleOption text-sm font-semibold">Alarm</span>
          <div className="flex items-center">
            <span className="todoOption">None</span>
            <IconButton size="small">
              <ArrowForwardIosIcon fontSize="small" className="todoOption" />
            </IconButton>
          </div>
        </div>

        <div className="flex justify-between items-center py-4 px-6">
          <span className="titleOption text-sm font-semibold">Reminder</span>
          <div className="flex items-center">
            <input
              type="date"
              className="border-none bg-transparent todoOption text-right outline-none cursor-pointer"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex justify-between items-center py-4 px-6">
          <span className="titleOption text-sm font-semibold">Status</span>
          <div className="flex items-center">
            <select
              className="border-none bg-transparent todoOption text-right outline-none cursor-pointer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="not_completed">Not Completed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center py-4 px-6">
          <span className="titleOption text-sm font-semibold">Priority</span>
          <div className="flex items-center">
            <span className="todoOption">Low</span>
            <IconButton size="small">
              <ArrowForwardIosIcon fontSize="small" className="todoOption" />
            </IconButton>
          </div>
        </div>
      </div>
    </form>
  );
}