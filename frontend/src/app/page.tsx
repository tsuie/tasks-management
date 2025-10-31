"use client";

import { useCallback, useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "@/lib/api";
import type { Task, TaskStatus, TaskPriority, TaskQueryParams } from "@/types/task";
import TaskForm, { type TaskFormData } from "@/components/TaskForm";

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "">("");
  const [sortBy, setSortBy] = useState<"dueDate" | "createdAt" | "priority">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const params: TaskQueryParams = {
        page,
        limit,
        search: search || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        sortBy,
        sortOrder,
      };
      const response = await getTasks(params);
      setTasks(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter, priorityFilter, sortBy, sortOrder]);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(data: TaskFormData) {
    await createTask(data);
    await load();
  }

  async function onEdit(data: TaskFormData) {
    if (!editingTask) return;
    await updateTask(editingTask.id, data);
    setEditingTask(null);
    await load();
  }

  async function onDelete(id: number) {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id);
      await load();
    }
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Task Manager</h1>

      {/* Create/Edit Form */}
      <div className="mb-8">
        <h2 className="mb-3 text-lg font-medium">
          {editingTask ? "Edit Task" : "Create New Task"}
        </h2>
        <TaskForm
          task={editingTask || undefined}
          onSubmit={editingTask ? onEdit : onCreate}
          onCancel={editingTask ? () => setEditingTask(null) : undefined}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Search and Filters */}
      <div className="mb-6 grid gap-3 rounded-lg border p-4">
        <div className="flex items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search tasks..."
            className="flex-1 rounded-md border px-3 py-2"
          />
          <button
            onClick={resetFilters}
            className="rounded-md border px-4 py-2 hover:bg-zinc-50"
          >
            Reset
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as TaskStatus | "");
              setPage(1);
            }}
            className="rounded-md border px-3 py-2"
          >
            <option value="">All Statuses</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value as TaskPriority | "");
              setPage(1);
            }}
            className="rounded-md border px-3 py-2"
          >
            <option value="">All Priorities</option>
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "dueDate" | "createdAt" | "priority")}
            className="rounded-md border px-3 py-2"
          >
            <option value="createdAt">Created Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="rounded-md border px-3 py-2"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-zinc-500">No tasks found.</p>
      ) : (
        <>
          <div className="mb-4 text-sm text-zinc-600">
            Showing {tasks.length} of {total} tasks
          </div>
          <ul className="mb-6 grid gap-3">
            {tasks.map((t) => (
              <li key={t.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-medium">{t.title}</h2>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          t.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : t.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {PRIORITY_LABELS[t.priority]}
                      </span>
                      <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                        {STATUS_LABELS[t.status]}
                      </span>
                    </div>
                    {t.description && (
                      <p className="mt-1 text-sm text-zinc-600">{t.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-4 text-xs text-zinc-400">
                      <span>#{t.id}</span>
                      <span>Created: {new Date(t.createdAt).toLocaleString()}</span>
                      {t.dueDate && (
                        <span className="text-orange-600">
                          Due: {new Date(t.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingTask(t)}
                      className="rounded-md border px-3 py-1 text-sm hover:bg-zinc-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md border px-3 py-2 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`rounded-md px-3 py-2 ${
                        page === pageNum
                          ? "bg-black text-white"
                          : "border hover:bg-zinc-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-md border px-3 py-2 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
