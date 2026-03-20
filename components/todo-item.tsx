"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function TodoItem({ todo }: {
  todo: { id: string; content: string; status: string };
}) {
  const queryClient = useQueryClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const completed = todo.status === "completed";

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Delete API failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: string }) => {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Update API failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  function deleteTodo(id: string) { if (id) deleteMutation.mutate(id); }
  function updateStatus(id: string, newStatus: string) { if (id) updateMutation.mutate({ id, newStatus }); }

  return (
    <div className="flex justify-between px-2 py-4 border-b-2 border-gray-100">
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-2 md:mr-4">
          {completed ? (
            <svg
              fill="#f4d239"
              height="32"
              width="32"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer"
              onClick={() => updateStatus(todo.id, "not_completed")}
            >
              <path d="m10 17-5-5 1.41-1.42 3.59 3.59 7.59-7.59 1.41 1.42m-7-6a10 10 0 0 0 -10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10 10 10 0 0 0 -10-10z" />
            </svg>
          ) : (
            <svg
              fill="#c3c4c1"
              height="32"
              width="32"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer"
              onClick={() => updateStatus(todo.id, "completed")}
            >
              <path d="M511.5 966.9c-61.6 0-121.4-12.1-177.7-35.9-54.4-23-103.2-55.9-145.1-97.8-41.9-41.9-74.9-90.8-97.8-145.1-24-56.3-36.1-116.1-36.1-177.8s12.1-121.4 35.9-177.7c23-54.4 55.9-103.2 97.8-145.1s90.8-74.9 145.1-97.8c56.4-23.9 116.2-36 177.9-36s121.4 12.1 177.7 35.9c54.4 23 103.2 55.9 145.1 97.8 41.9 41.9 74.9 90.8 97.8 145.1 23.8 56.3 35.9 116.1 35.9 177.7s-12 121.6-35.8 177.9c-23 54.4-55.9 103.2-97.8 145.1-41.9 41.9-90.8 74.9-145.1 97.8-56.4 23.9-116.2 35.9-177.8 35.9z m0-893.2c-240.7 0-436.6 195.9-436.6 436.6 0 240.7 195.9 436.6 436.6 436.6 240.7 0 436.6-195.9 436.6-436.6 0-240.7-195.9-436.6-436.6-436.6z" />
            </svg>
          )}
        </div>
        <div>
          <p
            onClick={() => updateStatus(todo.id, completed ? "not_completed" : "completed")}
            className={`font-medium cursor-pointer ${completed ? "todoActiveTile" : ""}`}
            title="Toggle status"
          >
            {todo.content}
          </p>
          <p className={`text-sm text-gray-500 ${completed ? "text-gray-400" : ""}`}>
            {todo.status == 'not_completed' ? 'not completed' : 'completed'}
          </p>
        </div>
      </div>
      <div className="relative flex items-center mr-2 md:mr-3" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-full hover:bg-gray-100"
        >
          <MoreVertIcon />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 top-10 w-28 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="py-1">
              <Link
                href={`/todos/${todo.id}/edit`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </Link>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsDeleteDialogOpen(true);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80 max-w-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-500 mb-6">Do you want to delete this todo?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
              >
                No
              </button>
              <button
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  deleteTodo(todo.id);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
