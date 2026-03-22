import TodoForm from "@/components/todo-form";
import LogoutButton from "@/components/logout-button";
import { Suspense } from "react";


export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Edit Todo</h1>
      <div className="min-h-screen todoBackground flex flex-col pt-10 items-center px-4">
        <div className="w-full max-w-[450px]">
          <LogoutButton className="mb-6" />
        </div>
        <div className="w-full max-w-[450px] todoContent py-6 rounded-2xl shadow-lg">
          <Suspense fallback={<p className="text-center text-zinc-500">Loading form...</p>}>
            <TodoForm id={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
