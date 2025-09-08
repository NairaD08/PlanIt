import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

// ---- Wrapper: no hooks besides useAuth, no early-return before hooks in inner
export default function TaskList() {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="panel" style={{ opacity: 0.8 }}>
        Please log in to manage tasks.
      </div>
    );
  }
  return <TaskListInner user={user} />;
}

// ---- Inner: ALL your hooks live here and are always called
function TaskListInner({ user }) {
  // OPTIONAL: tasks per user (so different logins don't share)
  const storageKey = `planit-tasks:${user.email}`;

  // 1) state (array of tasks)
  const [tasks, setTasks] = useState(() => {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  });

  // 2) form state (if you did the payment bonus, keep your {type,title,amount,due})
  const [form, setForm] = useState({
    type: "task",
    title: "",
    amount: "",
    due: "",
  });

  // 3) persist to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks, storageKey]);
const toggle = (id) =>
  setTasks((prev) =>
    prev.map((t) =>
      t.id === id
        ? {
            ...t,
            done: !t.done,
            completedAt: !t.done ? new Date().toISOString() : null, // set when marking done
          }
        : t
    )
  );
  // 4) add task  (keep your version if you already extended it)
  const addTask = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const newTask = {
      id: crypto.randomUUID(),
      type: form.type,
      title: form.title.trim(),
      due: form.due || null,
      amount:
        form.type === "payment" && form.amount ? Number(form.amount) : null,
      done: false,
    };
    setTasks((prev) => [newTask, ...prev]);
    setForm({ type: "task", title: "", amount: "", due: "" });
  };

  


  const remove = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  // (If you added filters earlier, keep that logic here)
  
// ---- date helpers
const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const today = startOfDay(new Date());

const daysUntil = (iso) => {
  if (!iso) return null;
  const due = startOfDay(new Date(iso));
  return Math.round((due - today) / (1000 * 60 * 60 * 24));
};
// ---- stats
const completedToday = tasks.filter(
  (t) => t.done && t.completedAt && startOfDay(new Date(t.completedAt)).getTime() === today.getTime()
).length;

const overdue = tasks.filter(
  (t) => !t.done && t.due && daysUntil(t.due) < 0
).length;

const dueToday = tasks.filter(
  (t) => !t.done && t.due && daysUntil(t.due) === 0
).length;

const dueThisWeek = tasks.filter(
  (t) => !t.done && t.due && daysUntil(t.due) >= 0 && daysUntil(t.due) <= 7
).length;
const sorted = [...tasks].sort((a, b) =>
    (a.due || "").localeCompare(b.due || "")
  );
const active = tasks.filter((t) => !t.done).length;
<div className="chip">🟡 Active: {tasks.filter((t) => !t.done).length}</div>


  return (
    
    <div>
        
<div className="panel" style={{ marginBottom: 12, display: "grid", gap: 8 }}>
  <div style={{ fontWeight: 700, opacity: 0.9 }}>Quick Stats</div>
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    <div className="chip">✅ Completed today: {completedToday}</div>
    <div className="chip" style={{ borderColor: "var(--overdue, #ef4444)" }}>⏳ Overdue: {overdue}</div>
    <div className="chip" style={{ borderColor: "var(--today, #06b6d4)" }}>📅 Due today: {dueToday}</div>
    <div className="chip">🗓️ Due this week: {dueThisWeek}</div>
    <div className="chip">🟡 Active: {active}</div>
  </div>
</div>
      {/* your form UI (type/title/due/amount + Add) */}
      <form
        onSubmit={addTask}
        style={{ display: "grid", gap: 8, marginBottom: 12 }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value, amount: "" })
            }
            style={{ minWidth: 120 }}
          >
            <option value="task">Task</option>
            <option value="payment">Payment</option>
          </select>
          <input
            placeholder={
              form.type === "payment"
                ? "Pay Visa, Pay Rent…"
                : "Task title (e.g., Buy gift)"
            }
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
          <button className="theme-btn" type="submit">
            Add
          </button>
        </div>
      </form>

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
    