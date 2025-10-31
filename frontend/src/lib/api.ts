import type { TaskQueryParams, TaskListResponse } from "@/types/task";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function getTasks(params?: TaskQueryParams): Promise<TaskListResponse> {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
  }
  const url = `${BASE_URL}/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const res = await fetch(url, { cache: "no-store" });
  return handle(res);
}

export async function createTask(body: { title: string; description?: string; status?: 'pending' | 'in_progress' | 'done' }) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handle(res);
}

export async function updateTask(id: number, body: Partial<{ title: string; description?: string; status: 'pending' | 'in_progress' | 'done' }>) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handle(res);
}

export async function deleteTask(id: number) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete task ${id}`);
}
