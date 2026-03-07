import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useTodos(date?: string) {
  const { data, mutate } = useSWR(
    date ? `/api/todos?date=${date}` : "/api/todos",
    fetcher
  );

  return {
    todos: data,
    mutate
  };
}