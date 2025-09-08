import { useEffect, useState } from "react";

export default function TaskList() {
  // 1) state (array of tasks)
  const [tasks, setTasks] = useState(() => {
    const raw = localStorage.getItem("planit-tasks");
    return raw ? JSON.parse(raw) : [];
  });

  // 2) form state


  // 3) persist to localStorage
  useEffect(() => {
    localStorage.setItem("planit-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // 4) add task
  const addTask = (e) => {
  e.preventDefault();
  if (!form.title.trim()) return;

  const newTask = {
    id: crypto.randomUUID(),
    type: form.type,                     // "task" | "payment"
    title: form.title.trim(),
    due: form.due || null,
    amount: form.type === "payment" && form.amount ? Number(form.amount) : null,
    done: false,
  };

  setTasks((prev) => [newTask, ...prev]);
  setForm({ type: "task", title: "", amount: "", due: "" });
};


  // 5) toggle done
  const toggle = (id) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

  // 6) delete
  const remove = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  // 7) simple sort by due date (nulls last)
  const sorted = [...tasks].sort((a, b) =>
    (a.due || "").localeCompare(b.due || "")
  );
  const [filter, setFilter] = useState("all"); // "all" | "active" | "completed"
  const filtered = sorted.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "completed") return t.done;
    return true; // all
  });
const [form, setForm] = useState({ type: "task", title: "", amount: "", due: "" });

  return (
    <div>
      {/* add form */}
      <form onSubmit={addTask} style={{ display: "grid", gap: 8, marginBottom: 12 }}>
  <div style={{ display: "flex", gap: 8 }}>
    <select
      value={form.type}
      onChange={(e) => setForm({ ...form, type: e.target.value, amount: "" })}
      style={{ minWidth: 120 }}
    >
      <option value="task">Task</option>
      <option value="payment">Payment</option>
    </select>

    <input
      placeholder={form.type === "payment" ? "Pay Visa, Pay Rent…" : "Task title (e.g., Buy gift)"}
      value={form.title}
      onChange={(e) => setForm({ ...form, title: e.target.value })}
      style={{ flex: 1 }}
    />
  </div>

  <div style={{ display: "flex", gap: 8 }}>
    <input
      type="date"
      value={form.due}
      onChange={(e) => setForm({ ...form, due: e.target.value })}
      style={{ flex: 1 }}
    />

    {form.type === "payment" && (
      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Amount (e.g., 150.00)"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        style={{ width: 160 }}
      />
    )}

    <button className="theme-btn" type="submit">Add</button>
  </div>
</form>

      {filtered.length === 0 && (
        <div className="panel" style={{ opacity: 0.7 }}>
          No tasks yet — add one ↑
        </div>
      )}

      {filtered.map((t) => {
        // ... unchanged
      })}

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button
          type="button"
          className="theme-btn"
          onClick={() => setFilter("all")}
          style={{ opacity: filter === "all" ? 1 : 0.6 }}
        >
          All
        </button>
        <button
          type="button"
          className="theme-btn"
          onClick={() => setFilter("active")}
          style={{ opacity: filter === "active" ? 1 : 0.6 }}
        >
          Active
        </button>
        <button
          type="button"
          className="theme-btn"
          onClick={() => setFilter("completed")}
          style={{ opacity: filter === "completed" ? 1 : 0.6 }}
        >
          Completed
        </button>
      </div>

      {/* list */}
      <div style={{ display: "grid", gap: 8 }}>
        {sorted.length === 0 && (
          <div className="panel" style={{ opacity: 0.7 }}>
            No tasks yet — add one ↑
          </div>
        )}

        {sorted.map((t) => {
          const dayText = t.due
            ? new Date(t.due).toLocaleDateString()
            : "No due date";
          return (
            <div
              key={t.id}
              className="panel"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggle(t.id)}
                />
                <div>
                  <input
  type="checkbox"
  checked={t.done}
  onChange={() => toggle(t.id)}
/>
<div>
  <div
    style={{
      fontWeight: 600,
      textDecoration: t.done ? "line-through" : "none",
      opacity: t.done ? 0.6 : 1,
    }}
  >
    {t.title}

    {t.type === "payment" && t.amount != null && (
      <span
        style={{
          marginLeft: 8,
          padding: "2px 8px",
          borderRadius: 999,
          border: "1px solid var(--border)",
          fontSize: 12,
          opacity: 0.9,
        }}
      >
        ${t.amount.toFixed(2)}
      </span>
    )}

    {t.type === "payment" && (
      <span
        style={{
          marginLeft: 8,
          padding: "2px 8px",
          borderRadius: 999,
          background: "transparent",
          border: "1px solid var(--border)",
          fontSize: 12,
          opacity: 0.7,
        }}
      >
        Payment
      </span>
    )}
  </div>

  <div style={{ fontSize: 13, opacity: 0.7 }}>{dayText}</div>
</div>

                  <div style={{ fontSize: 13, opacity: 0.7 }}>{dayText}</div>
                </div>
              </label>

              <button className="theme-btn" onClick={() => remove(t.id)}>
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
