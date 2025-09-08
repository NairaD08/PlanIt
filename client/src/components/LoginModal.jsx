// src/components/LoginModal.jsx
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function LoginModal({ mode = "login", onClose }) {
  const { login, register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const isRegister = mode === "register";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) register(form);
    else login(form);
    onClose?.();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>{isRegister ? "Create account" : "Login"}</h3>
          <button onClick={onClose}>Close</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, marginTop: 12 }}>
          <input
            placeholder="Name (shown in Hello, Name)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          {/* password is mock-only right now */}
          <input
            type="password"
            placeholder="Password (mock)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="theme-btn" type="submit">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
