import TodoForm from "@/components/todo-form";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Edit Todo</h1>
      <div className="min-h-screen todoBackground flex justify-center items-center">
        <div className="w-[450px] todoContent py-6 rounded-2xl shadow-lg">
          <TodoForm id={id} />
        </div>
      </div>
    </div>
  );
}
