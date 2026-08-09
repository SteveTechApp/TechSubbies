import React, { useEffect, useMemo, useState } from 'react';
import type { EngineerProfile } from '../types';
import type { CompletionValidation } from '../types/trust';
import { buildCapabilityPassport } from '../services/trustEngine';
import apiService from '../services/apiService';

export function CapabilityPassportPanel({ engineer, canManageTalentPool=false }: { engineer: EngineerProfile; canManageTalentPool?: boolean }) {
  const [validations,setValidations]=useState<CompletionValidation[]>([]);
  const [poolStatus,setPoolStatus]=useState('');
  useEffect(()=>{ apiService.getEngineerValidations(engineer.id).then(setValidations).catch(()=>setValidations([])); },[engineer.id]);
  const passport=useMemo(()=>buildCapabilityPassport(engineer,validations),[engineer,validations]);
  async function addToPool(){ try{await apiService.saveTalentPoolEntry(engineer.id,{list:'preferred',approvedRoleIds:passport.roleProfiles.filter((item)=>['client-validated','proven'].includes(item.confidence)).map((item)=>item.roleId),privateNotes:''});setPoolStatus('Added to preferred engineers.');}catch(error:any){setPoolStatus(error.message||'Could not update talent pool.');} }
  return <section className="rounded-xl border border-cyan-200 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-900">Technical Capability Passport</h2><p className="mt-1 text-sm text-slate-600">Role-specific confidence based on claims, evidence and completed work.</p></div>{canManageTalentPool&&<button onClick={addToPool} className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-bold text-white">Add to preferred pool</button>}</div>
    <div className="mt-4 grid gap-3 md:grid-cols-2">{passport.roleProfiles.length?passport.roleProfiles.map((role)=><article key={role.roleId} className="rounded-lg border border-slate-200 p-3"><div className="flex justify-between gap-2"><strong className="text-slate-900">{role.roleId}</strong><span className="rounded-full bg-cyan-50 px-2 py-1 text-xs font-bold text-cyan-800">{role.confidence}</span></div><p className="mt-2 text-xs text-slate-500">Level: {role.overallCapability||'legacy profile'} · {role.supportingEvidence.length} supporting record(s)</p></article>):<p className="text-sm text-slate-500">No specialist capability profiles saved yet.</p>}</div>
    <div className="mt-4 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-slate-100 px-3 py-2">Availability: {passport.availabilityConfidence.label}</span><span className="rounded-full bg-slate-100 px-3 py-2">Completed validations: {validations.length}</span></div>{poolStatus&&<p className="mt-3 text-sm text-cyan-800">{poolStatus}</p>}
  </section>;
}
