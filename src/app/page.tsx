"use client";

import { useMemo, useState } from "react";

type Platform = "YouTube" | "Instagram" | "Facebook";
type Item = { title: string; topic: string; status: string; time: string; platforms: Platform[] };

const initialQueue: Item[] = [
  { title: "7 AI Tools You Should Know in 2026", topic: "AI productivity", status: "Scheduled", time: "Today · 6:00 PM", platforms: ["YouTube", "Instagram"] },
  { title: "The 60-Second Future of Work", topic: "Future of work", status: "Ready", time: "Tomorrow · 6:00 PM", platforms: ["YouTube", "Facebook"] },
  { title: "3 Free Apps That Save Hours Every Week", topic: "Productivity", status: "Producing", time: "Aug 20 · 6:00 PM", platforms: ["Instagram", "Facebook"] },
];

export default function Home() {
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState("");
  const [queue, setQueue] = useState(initialQueue);
  const [niche, setNiche] = useState("AI & Technology");
  const [posts, setPosts] = useState("1");
  const [frequency, setFrequency] = useState("Daily");
  const [selected, setSelected] = useState<Platform[]>(["YouTube", "Instagram"]);
  const [autoApprove, setAutoApprove] = useState(true);

  const activeCount = useMemo(() => queue.filter(x => x.status !== "Published").length, [queue]);

  function togglePlatform(p: Platform) {
    setSelected(v => v.includes(p) ? v.filter(x => x !== p) : [...v, p]);
  }

  async function createAutomation(e: React.FormEvent) {
    e.preventDefault();
    const topic = niche.trim() || "AI & Technology";
    const newItem: Item = {
      title: `${topic}: the next big trend`,
      topic,
      status: autoApprove ? "Scheduled" : "Ready",
      time: "Tomorrow · 6:00 PM",
      platforms: selected.length ? selected : ["YouTube"],
    };
    setQueue(v => [newItem, ...v]);
    setShowCreate(false);
    setToast(`Automation created · ${frequency}, ${posts} post/day`);
    setTimeout(() => setToast(""), 3000);
    try {
      await fetch("/api/automations", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ niche: topic, postsPerDay: Number(posts), frequency, platforms: selected, autoApprove }) });
    } catch { /* UI remains usable in demo mode */ }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">✦</div> AutoPilot Social</div>
        <nav className="nav">
          <button className="active">⌂ &nbsp; Overview</button><button>⚡ &nbsp; Automations</button><button>▣ &nbsp; Content Queue</button><button>◷ &nbsp; Scheduler</button><button>◎ &nbsp; Analytics</button><button>◉ &nbsp; Connections</button><button>⚙ &nbsp; Settings</button>
        </nav>
        <div className="sidebar-bottom"><div className="profile"><b>Workspace</b><br/>Creator Studio<br/><span>Automation engine: online</span></div></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div><div className="eyebrow">Creator Studio / Overview</div><h1 className="title">Your content runs itself.</h1><p className="subtitle">Generate → produce → schedule → publish → learn.</p></div>
          <button className="btn primary" onClick={() => setShowCreate(true)}>＋ Create automation</button>
        </header>

        <section className="cards">
          <div className="card"><div className="muted">Active automations</div><div className="metric">3</div><div className="muted">+1 this week</div></div>
          <div className="card"><div className="muted">Queued content</div><div className="metric">{activeCount}</div><div className="muted">Next publish in 14h</div></div>
          <div className="card"><div className="muted">Published this month</div><div className="metric">27</div><div className="muted">+18% vs last month</div></div>
          <div className="card"><div className="muted">Avg. engagement</div><div className="metric">8.4%</div><div className="muted">AI optimization active</div></div>
        </section>

        <div className="grid">
          <section className="section"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2>Content queue</h2><button className="btn">View all</button></div><div className="queue">
            {queue.map((item, i) => <div className="queue-item" key={`${item.title}-${i}`}><div><div className="queue-title">{item.title}</div><div className="muted">{item.topic} · {item.time}</div><div className="chips">{item.platforms.map(p => <span className="chip" key={p}>{p}</span>)}</div></div><span className="status">{item.status}</span></div>)}
          </div></section>

          <section className="section"><h2>Automation pipeline</h2><div className="pipeline"><div className="step"><span className="dot done"/>Trend research <span className="muted" style={{marginLeft:"auto"}}>Complete</span></div><div className="step"><span className="dot done"/>Script + metadata <span className="muted" style={{marginLeft:"auto"}}>Complete</span></div><div className="step"><span className="dot active"/>Voice + video <span className="muted" style={{marginLeft:"auto"}}>Processing</span></div><div className="step"><span className="dot"/>Thumbnail + SEO <span className="muted" style={{marginLeft:"auto"}}>Waiting</span></div><div className="step"><span className="dot"/>Publish + analytics <span className="muted" style={{marginLeft:"auto"}}>Queued</span></div></div></section>
        </div>

        <section className="section" style={{marginTop:18}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><h2 style={{margin:0}}>Connected platforms</h2><span className="status">3 ready</span></div><div className="platforms"><div className="platform on">▶ YouTube · Connected</div><div className="platform on">◎ Instagram · Connected</div><div className="platform on">f Facebook · Connected</div></div></section>

        {showCreate && <div className="modal"><div className="modal-card"><div className="modal-head"><div><h2 style={{margin:"0 0 4px"}}>Create automation</h2><div className="muted">Set the rules. The pipeline handles the rest.</div></div><button className="close" onClick={() => setShowCreate(false)}>×</button></div><form className="form" onSubmit={createAutomation}><div className="field"><label>Niche / content topic</label><input value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. AI & Technology" /></div><div className="row"><div className="field"><label>Posts per day</label><select value={posts} onChange={e => setPosts(e.target.value)}><option>1</option><option>2</option><option>3</option><option>5</option></select></div><div className="field"><label>Frequency</label><select value={frequency} onChange={e => setFrequency(e.target.value)}><option>Daily</option><option>Weekdays</option><option>Weekly</option></select></div></div><div className="field"><label>Publish platforms</label><div className="platforms">{(["YouTube","Instagram","Facebook"] as Platform[]).map(p => <button type="button" key={p} className={`platform ${selected.includes(p) ? "on" : ""}`} onClick={() => togglePlatform(p)}>{p}</button>)}</div></div><div className="step"><span className={`dot ${autoApprove ? "done" : ""}`}/><div><b>Auto-approve content</b><div className="muted">Skip manual review when generation passes policy checks.</div></div><button type="button" className="btn" style={{marginLeft:"auto"}} onClick={() => setAutoApprove(v => !v)}>{autoApprove ? "On" : "Off"}</button></div><div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:4}}><button type="button" className="btn" onClick={() => setShowCreate(false)}>Cancel</button><button className="btn primary">Launch automation</button></div></form></div></div>}
        {toast && <div className="toast">✓ {toast}</div>}
      </main>
    </div>
  );
}
