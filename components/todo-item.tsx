"use client";

import Link from "next/link";

export default function TodoItem({ todo, mutate }: {
  todo: { id: string; content: string; status: string };
  mutate: () => void;
}) {
  const completed = todo.status === "completed";

  async function deleteTodo(id: string) {
    if (!id) return;
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (!res.ok) console.error("Delete API failed", await res.json());
    mutate();
  }

  async function updateStatus(id: string, newStatus: string) {
    if (!id) return;
    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) console.error("Update API failed", await res.json());
    mutate();
  }

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
            className={`font-medium ${completed ? "todoActiveTile" : ""}`}
          >
            {todo.content}
          </p>
          <p className={`text-sm text-gray-500 ${completed ? "text-gray-400" : ""}`}>
            {todo.status == 'not_completed' ? 'not completed' : 'completed'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-5 mr-2 md:mr-3">
        <Link
          href={`/todos/${todo.id}/edit`}
          className="text-black text-sm font-medium hover:underline"
        >
          Edit
        </Link>
        <button
          onClick={() => deleteTodo(todo.id)}
          className="text-red-600 text-sm font-medium hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
