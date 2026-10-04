const { useEffect, useMemo, useState } = React;

const initialTasks = [
  { id: 1, text: "Review chapter 4 notes", subject: "Mathematics", done: false },
  { id: 2, text: "Practice 15 chemistry questions", subject: "Chemistry", done: false },
  { id: 3, text: "Outline history essay", subject: "History", done: true },
];
const subjects = ["Mathematics", "Chemistry", "History", "Physics", "Other"];

function load(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } }

function App() {
  const [tasks, setTasks] = useState(() => load("studysprint-tasks", initialTasks));
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(() => Number(localStorage.getItem("studysprint-sessions")) || 3);
  const [draft, setDraft] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [quote, setQuote] = useState("Clarity comes after you begin, not before.");

  useEffect(() => localStorage.setItem("studysprint-tasks", JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem("studysprint-sessions", sessions), [sessions]);
  useEffect(() => { fetch("/api/motivation").then(r => r.ok ? r.json() : Promise.reject()).then(x => setQuote(x.message)).catch(() => undefined); }, []);
  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => setSeconds(value => {
      if (value <= 1) { clearInterval(timer); setRunning(false); setSessions(total => total + 1); return 25 * 60; }
      return value - 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [running]);

  const display = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const done = tasks.filter(task => task.done).length;
  const progress = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  const today = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  function addTask(event) { event.preventDefault(); if (!draft.trim()) return; setTasks([{ id: Date.now(), text: draft.trim(), subject, done: false }, ...tasks]); setDraft(""); }
  function toggle(id) { setTasks(tasks.map(task => task.id === id ? { ...task, done: !task.done } : task)); }

  return <main className="shell">
    <aside className="sidebar">
      <div className="logo"><span>✦</span> StudySprint</div>
      <div className="side-copy"><p>LEARN WITH INTENTION</p><h1>Small sprints.<br/><em>Big progress.</em></h1><blockquote>“{quote}”</blockquote></div>
      <div className="streak"><span>⚡</span><div><strong>{sessions} sessions</strong><small>completed this week</small></div></div>
    </aside>
    <section className="workspace">
      <header><div><p className="date">{today}</p><h2>Ready when you are.</h2></div><span className="avatar">S</span></header>
      <div className="cards">
        <article className="timer-card"><div className="card-label"><span>FOCUS TIMER</span><i className={running ? "live" : ""}></i></div><div className="timer">{display}</div><p>{running ? "Stay with this one thing." : "A 25-minute sprint is waiting."}</p><div className="timer-actions"><button className="primary" onClick={() => setRunning(!running)}>{running ? "Pause" : "Start focus"}</button><button className="ghost" onClick={() => { setRunning(false); setSeconds(25 * 60); }}>Reset</button></div></article>
        <article className="progress-card"><span>WEEKLY RHYTHM</span><h3>{sessions}<small> / 10 sessions</small></h3><div className="bars">{[32, 54, 24, 74, 63, 88, 42].map((height, index) => <i key={index} className={index === 5 ? "today" : ""} style={{height: `${height}%`}} />)}</div><p>You’re building a steady habit.</p></article>
      </div>
      <section className="tasks"><div className="tasks-head"><div><span>YOUR STUDY PLAN</span><h3>Today’s next steps</h3></div><strong>{progress}% <small>done</small></strong></div><div className="meter"><i style={{width: `${progress}%`}} /></div>
        <form onSubmit={addTask}><input value={draft} onChange={event => setDraft(event.target.value)} maxLength="100" placeholder="Add a study task…"/><select value={subject} onChange={event => setSubject(event.target.value)}>{subjects.map(item => <option key={item}>{item}</option>)}</select><button type="submit">Add <b>+</b></button></form>
        <ul>{tasks.map(task => <li className={task.done ? "complete" : ""} key={task.id}><button className="check" onClick={() => toggle(task.id)} aria-label="Toggle task">{task.done ? "✓" : ""}</button><span>{task.text}</span><em>{task.subject}</em><button className="delete" onClick={() => setTasks(tasks.filter(item => item.id !== task.id))} aria-label="Delete task">×</button></li>)}</ul>
      </section>
    </section>
  </main>;
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);

