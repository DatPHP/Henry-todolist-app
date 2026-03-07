import TodoForm from "@/components/todo-form";

export default function CreatePage() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Create Todo</h1>
      <TodoForm />
    </div>
  );
}