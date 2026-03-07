import Link from "next/link";

export default function TodoItem({ todo, mutate }: any) {

    async function deleteTodo() {

        console.log("Deleting id:", todo.id);
      
        if (!todo?.id) {
          alert("Todo ID missing");
          return;
        }
      
        await fetch(`/api/todos/${todo.id}`, {
          method: "DELETE"
        });
      
        mutate();
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
          onClick={deleteTodo}
          className="text-red-600"
        >
          Delete
        </button>

      </div>

    </div>
  );
}