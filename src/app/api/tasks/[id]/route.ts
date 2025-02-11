import Task from "@/src/models/Task";

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    const tasks = await Task.findById({ id });

    if (tasks.length === 0) {
      return new Response(
        JSON.stringify({ message: "Нет задач" }),
        { status: 200 }
      );
    }

    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении задач:", error);
    return new Response(
      JSON.stringify({ error: "Ошибка при получении данных" }),
      { status: 500 }
    );
  }
};
