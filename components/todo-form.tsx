"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { todoSchema, TodoInput } from "@/lib/validations";

export default function TodoForm({ id }: { id?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<TodoInput>({
    resolver: zodResolver(todoSchema) as any,
    defaultValues: {
      content: "",
      date: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10),
      status: "not_completed",
      priority: "Medium",
      type: "Work",
    },
  });

  const watchDate = watch("date");

  const { data: todoData, isLoading, error: queryError } = useQuery({
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
    if (todoData) {
      reset({
        content: todoData.content ?? "",
        date: todoData.date ? new Date(todoData.date).toISOString().slice(0, 10) : "",
        status: todoData.status ?? "not_completed",
        priority: todoData.priority ?? "Medium",
        type: todoData.type ?? "Work",
      });
    }
  }, [todoData, reset]);

  const saveMutation = useMutation({
    mutationFn: async (data: TodoInput) => {
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
        const errData = await response.json();
        throw new Error(errData.error || "Failed to save todo");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success(id ? "Todo updated successfully!" : "Todo created successfully!");
      router.push(`/?date=${watchDate}`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    }
  });

  const onSubmit = (data: TodoInput) => {
    saveMutation.mutate(data);
  };

  const handleCancel = () => {
    router.push(`/?date=${watchDate}`);
  };

  if (id && isLoading) {
    return <p className="text-gray-500">Loading todo...</p>;
  }

  if (queryError) {
    return (
      <div className="space-y-2">
        <p className="text-red-600">{queryError.message}</p>
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
      <div className="px-6">
        <TextField
          variant="standard"
          placeholder="Write your task"
          fullWidth
          multiline
          minRows={1}
          className="todoInput"
          {...register("content")}
          error={!!errors.content}
          helperText={errors.content?.message}
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: "26px" },
          }}
        />
      </div>

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
          <div className="flex flex-col">
            <span className="titleOption text-sm font-semibold">Reminder</span>
            {errors.date && <span className="text-red-500 text-xs">{errors.date.message}</span>}
          </div>
          <div className="flex items-center">
            <input
              type="date"
              className={`border-none bg-transparent todoOption text-right outline-none cursor-pointer ${errors.date ? 'text-red-500' : ''}`}
              {...register("date")}
            />
          </div>
        </div>

        <div className="flex justify-between items-center py-4 px-6">
          <span className="titleOption text-sm font-semibold">Status</span>
          <div className="flex items-center">
            <select
              className="border-none bg-transparent todoOption text-right outline-none cursor-pointer"
              {...register("status")}
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
              {...register("priority")}
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
              {...register("type")}
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