import React, { useState } from "react";
import apiService from "../services/apiService";
import { useAppContext } from "../context/InteractionContext";
import { calculateAvailabilityConfidence } from "../services/trustEngine";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
const input = "mt-2 w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-white";

export default function EngineerAvailabilityPage() {
  const { user } = useAppContext();
  const profile: any = user?.profile || {};
  const [form, setForm] = useState({ availableFrom: profile.availableFrom || new Date().toISOString().slice(0,10), baseLocation: profile.baseLocation || profile.location || "", travelRadiusMiles: profile.travelRadiusMiles ?? 50, workingDays: profile.workingDays || ["Monday","Tuesday","Wednesday","Thursday","Friday"], minimumNoticeDays: profile.minimumNoticeDays ?? 2, overnightWork: profile.overnightWork ?? false, weekendWork: profile.weekendWork || "no", emergencyCallout: profile.emergencyCallout ?? false });
  const [confirmedAt, setConfirmedAt] = useState<string | undefined>(profile.availabilityConfirmedAt);
  const [status, setStatus] = useState("");
  const confidence = calculateAvailabilityConfidence(confirmedAt);

  async function save(event: React.FormEvent) { event.preventDefault(); setStatus("Saving…"); try { const saved=await apiService.confirmAvailability(form); const timestamp=saved.profile?.availabilityConfirmedAt || saved.availabilityConfirmedAt || new Date().toISOString(); setConfirmedAt(timestamp); setStatus("Availability confirmed and visible to matching clients."); } catch(error:any) { setStatus(error.message); } }
  function toggleDay(day:string) { setForm((current:any)=>({...current,workingDays:current.workingDays.includes(day)?current.workingDays.filter((item:string)=>item!==day):[...current.workingDays,day]})); }

  return <main className="min-h-screen bg-slate-950 px-5 py-8 text-white"><form onSubmit={save} className="mx-auto max-w-4xl">
    <a href="/engineer/profile" className="font-bold text-cyan-300">Back to Engineer Profile Hub</a>
    <div className="mt-6 flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Discovery controls</p><h1 className="mt-2 text-3xl font-bold">Availability and working area</h1><p className="mt-2 text-slate-400">Confirm this regularly so clients can distinguish current availability from an old profile claim.</p></div><div className={`rounded-2xl border px-4 py-3 ${confidence.score >= 65 ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" : "border-amber-300/30 bg-amber-300/10 text-amber-100"}`}><div className="font-bold">{confidence.score}% confidence</div><div className="text-xs capitalize">{confidence.label.replace("-"," ")}</div></div></div>
    <section className="mt-7 grid gap-5 rounded-2xl border border-white/10 bg-slate-900 p-6 md:grid-cols-2">
      <label>Available from<input required type="date" value={form.availableFrom} onChange={e=>setForm({...form,availableFrom:e.target.value})} className={input}/></label>
      <label>Base location<input required value={form.baseLocation} onChange={e=>setForm({...form,baseLocation:e.target.value})} className={input} placeholder="Town, city or postcode area"/></label>
      <label>Normal travel radius (miles)<input type="number" min="0" max="1000" value={form.travelRadiusMiles} onChange={e=>setForm({...form,travelRadiusMiles:Number(e.target.value)})} className={input}/></label>
      <label>Minimum notice (days)<input type="number" min="0" max="365" value={form.minimumNoticeDays} onChange={e=>setForm({...form,minimumNoticeDays:Number(e.target.value)})} className={input}/></label>
      <label>Weekend work<select value={form.weekendWork} onChange={e=>setForm({...form,weekendWork:e.target.value})} className={input}><option value="no">No</option><option value="yes">Yes</option><option value="premium-only">Premium rate only</option></select></label>
      <div className="space-y-3 pt-2"><label className="flex gap-3"><input type="checkbox" checked={form.overnightWork} onChange={e=>setForm({...form,overnightWork:e.target.checked})}/>Available for overnight work</label><label className="flex gap-3"><input type="checkbox" checked={form.emergencyCallout} onChange={e=>setForm({...form,emergencyCallout:e.target.checked})}/>Available for emergency callouts</label></div>
      <fieldset className="md:col-span-2"><legend className="font-bold">Normal working days</legend><div className="mt-3 flex flex-wrap gap-2">{days.map(day=><button type="button" key={day} onClick={()=>toggleDay(day)} className={`rounded-full px-4 py-2 text-sm font-bold ${form.workingDays.includes(day)?"bg-cyan-300 text-slate-950":"border border-white/15 text-slate-300"}`}>{day.slice(0,3)}</button>)}</div></fieldset>
    </section>
    <div className="mt-5 flex items-center justify-end gap-4"><span className="text-sm text-slate-400">{status}</span><button disabled={!form.workingDays.length} className="rounded-xl bg-cyan-300 px-6 py-3 font-bold text-slate-950 disabled:opacity-40">Confirm availability now</button></div>
  </form></main>;
}
