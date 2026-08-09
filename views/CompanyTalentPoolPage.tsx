import React, { useEffect, useMemo, useState } from "react";
import apiService from "../services/apiService";
import type { TalentPoolEntry } from "../types/trust";

const lists: TalentPoolEntry["list"][] = ["preferred", "approved", "backup", "restricted"];

export default function CompanyTalentPoolPage() {
  const [entries, setEntries] = useState<TalentPoolEntry[]>([]);
  const [filter, setFilter] = useState<"all" | TalentPoolEntry["list"]>("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiService.getTalentPool().then(setEntries).catch((error) => setMessage(error.message)).finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => filter === "all" ? entries : entries.filter((entry) => entry.list === filter), [entries, filter]);

  async function updateEntry(entry: TalentPoolEntry, patch: Partial<TalentPoolEntry>) {
    setMessage("");
    try {
      const saved = await apiService.saveTalentPoolEntry(entry.engineerId, {
        list: patch.list ?? entry.list,
        approvedRoleIds: patch.approvedRoleIds ?? entry.approvedRoleIds,
        approvedClientOrSite: patch.approvedClientOrSite ?? entry.approvedClientOrSite,
        privateNotes: patch.privateNotes ?? entry.privateNotes,
      });
      setEntries((current) => current.map((item) => item.engineerId === entry.engineerId ? { ...item, ...saved } : item));
      setMessage("Talent-pool record saved.");
    } catch (error: any) { setMessage(error.message || "Could not save the record."); }
  }

  async function removeEntry(engineerId: string) {
    await apiService.removeTalentPoolEntry(engineerId);
    setEntries((current) => current.filter((entry) => entry.engineerId !== engineerId));
  }

  return <main className="min-h-screen bg-slate-950 px-5 py-8 text-white">
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Private company workspace</p><h1 className="mt-2 text-3xl font-bold">Engineer talent pool</h1><p className="mt-2 max-w-3xl text-slate-400">Reuse engineers your organisation already trusts. Lists, approved roles, client/site approvals and notes are visible only to your company.</p></div>
        <div className="flex gap-2"><a href="/company/team-assembly" className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold hover:border-cyan-300">Assemble project team</a><a href="/company/engineers" className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold hover:border-cyan-300">Engineer management</a></div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{(["all", ...lists] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${filter === item ? "bg-cyan-300 text-slate-950" : "border border-white/15 text-slate-300"}`}>{item} {item === "all" ? `(${entries.length})` : `(${entries.filter((entry) => entry.list === item).length})`}</button>)}</div>
      {message && <div className="mt-5 rounded-xl border border-cyan-300/25 bg-cyan-300/10 p-3 text-sm text-cyan-100">{message}</div>}
      {loading ? <p className="mt-8 text-slate-400">Loading talent pool…</p> : visible.length === 0 ? <div className="mt-8 rounded-2xl border border-dashed border-white/15 p-8 text-center text-slate-400">No engineers in this list yet. Add engineers from their Capability Passport.</div> : <div className="mt-6 grid gap-4 md:grid-cols-2">{visible.map((entry) => <section key={entry.id} className="rounded-2xl border border-white/10 bg-slate-900 p-5">
        <div className="flex items-start justify-between gap-3"><div><h2 className="font-bold">{entry.engineerName || entry.engineerId}</h2><p className="mt-1 text-xs text-slate-500">Updated {new Date(entry.updatedAt).toLocaleDateString("en-GB")}</p></div><select value={entry.list} onChange={(event) => updateEntry(entry, { list: event.target.value as TalentPoolEntry["list"] })} className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm capitalize">{lists.map((list) => <option key={list}>{list}</option>)}</select></div>
        <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-slate-400">Approved roles</label><input defaultValue={entry.approvedRoleIds.join(", ")} onBlur={(event) => updateEntry(entry, { approvedRoleIds: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} placeholder="Role IDs, comma separated" className="mt-2 w-full rounded-lg border border-white/15 bg-slate-950 p-3 text-sm" />
        <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-slate-400">Approved client or site</label><input defaultValue={entry.approvedClientOrSite} onBlur={(event) => updateEntry(entry, { approvedClientOrSite: event.target.value })} className="mt-2 w-full rounded-lg border border-white/15 bg-slate-950 p-3 text-sm" />
        <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-slate-400">Private notes</label><textarea defaultValue={entry.privateNotes} onBlur={(event) => updateEntry(entry, { privateNotes: event.target.value })} rows={3} className="mt-2 w-full rounded-lg border border-white/15 bg-slate-950 p-3 text-sm" />
        <button onClick={() => removeEntry(entry.engineerId)} className="mt-4 text-sm font-bold text-red-300 hover:text-red-200">Remove from talent pool</button>
      </section>)}</div>}
    </div>
  </main>;
}
