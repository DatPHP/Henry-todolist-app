"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { toast } from "react-toastify";

export default function TodoForm({ id }: { id?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("not_completed");
  const [priority, setPriority] = useState("Medium");
  const [type, setType] = useState("Work");
  const [error, setError] = useState<string | null>(null);

  const { data: todoData, isLoading } = useQuery({
    queryKey: ['todo', id],
    queryFn: async () => {
      const res = await fetch(`/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error(res.status === 404 ? "Todo not found" : "Failed to load");
      return res.json();
    },
    enabled: !!id,
    retry: false,
  });

  useEffect(() => {
    if (!id) {
      // Set to local today's date
      const today = new Date();
      const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      setDate(localToday);
    } else if (todoData) {
      setContent(todoData.content ?? "");
      setDate(todoData.date ? new Date(todoData.date).toISOString().slice(0, 10) : "");
      setStatus(todoData.status ?? "not_completed");
      setPriority(todoData.priority ?? "Medium");
      setType(todoData.type ?? "Work");
    }
  }, [id, todoData]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/todos/${id}` : "/api/todos";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save todo");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success(id ? "Todo updated successfully!" : "Todo created successfully!");
      router.push(`/?date=${date}`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "An error occurred");
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  });

  function handleSubmit(e: any) {
    e.preventDefault();
    saveMutation.mutate({ content, date, status, priority, type });
  }

  const handleCancel = () => {
    router.push(`/?date=${date}`);
  };

  if (id && isLoading) {
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
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? "Saving..." : (id ? "Update task" : "Add task")}
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
            <select
              className="border-none bg-transparent todoOption text-right outline-none cursor-pointer"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center py-4 px-6">
          <span className="titleOption text-sm font-semibold">Type</span>
          <div className="flex items-center">
            <select
              className="border-none bg-transparent todoOption text-right outline-none cursor-pointer"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Work">Work</option>
              <option value="Study">Study</option>
              <option value="Chores">Chores</option>
              <option value="Leisure">Leisure</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  );
}