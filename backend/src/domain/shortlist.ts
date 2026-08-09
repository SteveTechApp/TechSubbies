import type { UserRow } from "../lib/db.js";
import { normaliseRoleId } from "./roleCatalog.js";
import type { MarketplaceApplicationDTO, PersistedJobDTO, ShortlistCandidateDTO, ShortlistOutcome } from "./marketplaceTypes.js";
import { decodePersistedObject } from "../lib/persistedData.js";
import { ENGINEER_PROFILE_SCHEMA_VERSION } from "./marketplaceTypes.js";

const clean=(value:unknown)=>String(value||"").trim().toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const level:Record<string,number>={assist:1,supervised:1,deliver:2,independent:2,diagnose:3,lead:4};
const values=(input:unknown):string[]=>Array.isArray(input)?input.map(item=>typeof item==='string'?item:String((item as any)?.label||(item as any)?.skillId||(item as any)?.skill||(item as any)?.name||'')).filter(Boolean):[];

export function assessApplicant(job:PersistedJobDTO,application:MarketplaceApplicationDTO,user:UserRow,nowMs=Date.now()):ShortlistCandidateDTO{
  const profile:any=decodePersistedObject(user.profile,{entity:"engineer profile",id:user.id,versionKey:"profileSchemaVersion",maximumVersion:ENGINEER_PROFILE_SCHEMA_VERSION});
  const profiles:any[]=[...(profile.capabilityProfiles||[]),...(profile.roleSkillProfiles||[]),...(profile.roleProfiles||[])];
  const roleProfile=profiles.find(item=>normaliseRoleId(String(item.roleId||item.expectationId||''))===job.roleId);
  const roleMatch=Boolean(roleProfile);
  const searchable=new Set<string>();
  const add=(value:unknown)=>{const key=clean(value);if(key)searchable.add(key)};
  values(profile.productTags).forEach(add);values(profile.brandTags).forEach(add);values(profile.platformTags).forEach(add);values(profile.certificationTags).forEach(add);values(profile.customKeywords).forEach(add);
  values(roleProfile?.keywords).forEach(add);values(roleProfile?.productTags).forEach(add);values(roleProfile?.brandTags).forEach(add);values(roleProfile?.platformTags).forEach(add);values(roleProfile?.certificationTags).forEach(add);values(roleProfile?.customKeywords).forEach(add);
  Object.entries(roleProfile?.productExperience||{}).forEach(([key,value])=>{add(key);add(`${key} ${value}`)});
  const candidateSkills=[...(roleProfile?.capabilities||[]),...(roleProfile?.ratings||[]),...(roleProfile?.skills||[])];candidateSkills.forEach((item:any)=>{if(!['not-offered','none','0'].includes(String(item.claim??item.selfLevel??'')))add(item.skillId||item.skill||item.name)});
  const hasDeclaredEvidence=(requirement:string)=>{const key=clean(requirement).replace(/\b(experience|knowledge|required|prerequisite)\b/g,'').replace(/\s+/g,' ').trim();return [...searchable].some(declared=>declared===key||(declared.length>=4&&key.includes(declared))||(key.length>=4&&declared.includes(key)));};
  const prerequisites=values(job.prerequisites);const matchedPrerequisites=prerequisites.filter(hasDeclaredEvidence);const missingPrerequisites=prerequisites.filter(item=>!hasDeclaredEvidence(item));
  const requiredSkills=values(Array.isArray(job.skillRequirements)?job.skillRequirements.filter((item:any)=>item?.required!==false):[]);const skillSet=new Set(candidateSkills.filter((item:any)=>!['not-offered','none','0'].includes(String(item.claim??item.selfLevel??''))).map((item:any)=>clean(item.skillId||item.skill||item.name)));const matchedSkills=requiredSkills.filter(item=>skillSet.has(clean(item)));const missingSkills=requiredSkills.filter(item=>!skillSet.has(clean(item)));
  const roleRequirement=job.roleRequirements.find((item)=>item.roleId===job.roleId)||job.roleRequirements[0];const legacyNeeds=Array.isArray(job.engineerNeeds)?job.engineerNeeds as Array<{workingArrangement?:unknown}>:[];const requested=level[clean(roleRequirement?.responsibility||legacyNeeds[0]?.workingArrangement||job.workingArrangement||'independent')]||2;const offered=level[clean(roleProfile?.overallCapability||roleProfile?.maximumResponsibility||'')]||0;const responsibilityFit=offered>=requested;
  const confirmedAt=profile.availabilityConfirmedAt||null;const age=confirmedAt?nowMs-new Date(confirmedAt).getTime():Infinity;const confidence=age<=7*86400000?'fresh':age<=30*86400000?'aging':confirmedAt?'stale':'unconfirmed';
  const evidenceCount=(roleProfile?.evidence||[]).length+(profile.uploadedEvidenceNotes||[]).length+candidateSkills.filter((item:any)=>item.evidenceNote||item.evidence).length;
  const reasons:string[]=[];const risks:string[]=[];
  if(roleMatch)reasons.push('Declared profile for the requested specialist role.');else risks.push('No declared profile for the requested specialist role.');
  if(responsibilityFit)reasons.push('Declared responsibility level meets the working arrangement.');else risks.push('Declared responsibility level is below or missing for this requirement.');
  if(prerequisites.length&&matchedPrerequisites.length)reasons.push(`${matchedPrerequisites.length} of ${prerequisites.length} mandatory prerequisites evidenced.`);if(missingPrerequisites.length)risks.push(`Missing mandatory prerequisites: ${missingPrerequisites.join(', ')}.`);
  if(requiredSkills.length&&matchedSkills.length)reasons.push(`${matchedSkills.length} of ${requiredSkills.length} requested capabilities declared.`);if(missingSkills.length)risks.push(`Capabilities to verify: ${missingSkills.join(', ')}.`);
  if(confidence==='fresh')reasons.push('Availability confirmed within 7 days.');else risks.push(confidence==='unconfirmed'?'Availability has not been confirmed.':'Availability confirmation is not recent.');
  if(evidenceCount)reasons.push(`${evidenceCount} profile evidence item${evidenceCount===1?'':'s'} recorded.`);else risks.push('No supporting profile evidence recorded.');
  const score=Math.max(0,Math.min(100,(roleMatch?40:0)+(responsibilityFit?20:0)+(prerequisites.length?Math.round(20*matchedPrerequisites.length/prerequisites.length):20)+(requiredSkills.length?Math.round(10*matchedSkills.length/requiredSkills.length):10)+(confidence==='fresh'?5:confidence==='aging'?3:0)+Math.min(5,evidenceCount)));
  const outcome:ShortlistOutcome=!roleMatch||missingPrerequisites.length?'excluded':(!responsibilityFit||missingSkills.length||confidence!=='fresh'?'review':'eligible');
  return {applicationId:application.id,engineerId:user.id,engineerName:user.name,outcome,score,roleMatch,responsibilityFit,matchedPrerequisites,missingPrerequisites,matchedSkills,missingSkills,availability:{confidence,confirmedAt},evidenceCount,reasons,risks};
}

export function buildShortlist(job:PersistedJobDTO,applications:MarketplaceApplicationDTO[],users:UserRow[]):ShortlistCandidateDTO[]{const byId=new Map(users.map(user=>[user.id,user]));const order:Record<ShortlistOutcome,number>={eligible:0,review:1,excluded:2};return applications.map(application=>{const user=byId.get(application.engineerId);return user&&user.role==='Engineer'?assessApplicant(job,application,user):null}).filter((item):item is ShortlistCandidateDTO=>Boolean(item)).sort((a,b)=>order[a.outcome]-order[b.outcome]||b.score-a.score||a.engineerName.localeCompare(b.engineerName));}
