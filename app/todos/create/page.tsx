import TodoForm from "@/components/todo-form";
import LogoutButton from "@/components/logout-button";


export default function CreatePage() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Create Todo</h1>
      <div className="min-h-screen todoBackground flex flex-col pt-10 items-center">
        <div className="w-[450px]">
          <LogoutButton className="mb-6" />
        </div>
        <div className="w-[450px] todoContent py-6 rounded-2xl shadow-lg">
          <TodoForm />
        </div>
      </div>
    </div>
  );
}