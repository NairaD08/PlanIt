import { useState } from "react";
import "./styles/globals.css";
import TaskList from "./components/TaskList";
import { useAuth } from "./auth/AuthContext";
import LoginModal from "./components/LoginModal";

function App() {
  const [theme, setTheme] = useState("dark");

  const hour = new Date().getHours();
  let salutation = "Hello";
  if (hour < 12) salutation = "Good morning";
  else if (hour < 18) salutation = "Good afternoon";
  else salutation = "Good evening";

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <div className="greeting">
          {salutation}
          {user ? `, ${user.name}` : ""}
        </div>
        <div className="spacer" />

        {!user ? (
          <>
            <button
              className="theme-btn"
              onClick={() => {
                setAuthMode("login");
                setAuthOpen(true);
              }}
            >
              Login
            </button>
            <button
              className="theme-btn"
              onClick={() => {
                setAuthMode("register");
                setAuthOpen(true);
              }}
            >
              Register
            </button>
          </>
        ) : (
          <button className="theme-btn" onClick={logout}>
            Logout
          </button>
        )}

        <button
          className="theme-btn"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          style={{ marginLeft: 8 }}
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      <main className="app-main">
        {/* Make this one clickable */}
        <section
          className="panel mini-calendar"
          onClick={() => setCalendarOpen(true)}
          style={{ cursor: "pointer" }}
        >
          Calendar (click to expand)
        </section>

        <section
          className="panel mini-notes"
          onClick={() => setNotesOpen(true)}
          style={{ cursor: "pointer" }}
        >
          Notes
        </section>
        <section className="panel upcoming">Upcoming</section>
        <section className="panel list">
          <TaskList />
        </section>
      </main>

      {calendarOpen && (
        <div className="modal-backdrop" onClick={() => setCalendarOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3>Calendar (fullscreen)</h3>
              <button onClick={() => setCalendarOpen(false)}>Close</button>
            </div>
            <div>Here we’ll show the full month and an Add Task form.</div>
          </div>
        </div>
      )}
      {notesOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => {
            console.log("NOTES CLICKED");
            setNotesOpen(true);
          }}
        >
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3>Notes</h3>
              <button onClick={() => setNotesOpen(false)}>Close</button>
            </div>
            <textarea
              placeholder="Write your notes here..."
              style={{ width: "100%", height: "50vh", padding: 8 }}
            />
          </div>
        </div>
      )}
      {authOpen && (
        <LoginModal mode={authMode} onClose={() => setAuthOpen(false)} />
      )}
    </div>
  );
}

export default App;
