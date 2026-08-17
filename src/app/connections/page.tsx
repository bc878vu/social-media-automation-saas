"use client";

import { useEffect, useState } from "react";

export default function ConnectionsPage() {
  const [workspaceId, setWorkspaceId] = useState("");
  const [message, setMessage] = useState("Loading workspace…");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/workspace");
      const data = await res.json();
      if (data.workspaces?.[0]) {
        setWorkspaceId(data.workspaces[0].id);
        setMessage(`Workspace: ${data.workspaces[0].name}`);
        return;
      }
      const created = await fetch("/api/workspace", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Creator Studio", niche: "AI & Technology", timezone: "Asia/Karachi", autoApprove: false }) });
      const body = await created.json();
      setWorkspaceId(body.workspace?.id ?? "");
      setMessage(body.workspace ? "Creator Studio workspace created." : "Unable to create workspace.");
    })().catch(() => setMessage("Unable to load workspace."));
  }, []);

  return <main className="main" style={{maxWidth:900}}><div className="eyebrow">Settings / Connections</div><h1 className="title">Connect publishing accounts</h1><p className="subtitle">OAuth only — passwords are never collected by AutoPilot Social.</p><section className="section" style={{marginTop:22}}><h2>Workspace</h2><div className="field"><label>Workspace ID</label><input value={workspaceId} onChange={e => setWorkspaceId(e.target.value)} placeholder="Workspace ID" /></div><p className="muted" style={{marginTop:10}}>{message}</p></section><section className="section" style={{marginTop:18,display:"grid",gap:12}}><h2>Platforms</h2><div className="queue-item"><div><b>YouTube</b><div className="muted">OAuth · upload videos · channel identity</div></div><a className="btn primary" href={workspaceId ? `/api/oauth/youtube?workspaceId=${encodeURIComponent(workspaceId)}` : "#"}>Connect YouTube</a></div><div className="queue-item"><div><b>Facebook + Instagram</b><div className="muted">Meta OAuth · Page publishing · Instagram professional account</div></div><a className="btn primary" href={workspaceId ? `/api/oauth/meta?workspaceId=${encodeURIComponent(workspaceId)}` : "#"}>Connect Meta</a></div></section><p className="muted" style={{marginTop:18}}>Production requirement: configure official developer apps, redirect URIs, approved permissions, HTTPS, and encryption secrets before enabling live publishing.</p></main>;
}
