import Link from "next/link";

export default function TodoItem({ todo, mutate }: any) {

    async function deleteTodo(id: string) {
        if (!id) {
          console.error("Delete failed: missing id");
          return;
        }
      
        const res = await fetch(`/api/todos/${id}`, {
          method: "DELETE",
        });
      
        if (!res.ok) {
          console.error("Delete API failed", await res.json());
        }
      
        mutate(); // refresh list
      }

  return (
    <div className="border p-3 rounded flex justify-between">

      <div>
        <p>{todo.content}</p>
        <p className="text-sm text-gray-500">{todo.status}</p>
      </div>

      <div className="space-x-2">

        <Link
          href={`/todos/${todo.id}/edit`}
          className="text-blue-600"
        >
          Edit
        </Link>

        <button
          onClick={() => deleteTodo(todo.id)}
          className="text-red-600"
        >
          Delete
        </button>

      </div>

    </div>
  );
}