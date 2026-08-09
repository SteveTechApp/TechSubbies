import { z } from "zod";
import { normaliseRoleId } from "./roleCatalog.js";
import { ENGINEER_PROFILE_SCHEMA_VERSION, JOB_SCHEMA_VERSION, type CanonicalEngineerProfileDTO, type CanonicalJobDTO } from "./marketplaceTypes.js";

type Responsibility="assist"|"deliver"|"diagnose"|"lead";
const text=(value:unknown,max=120)=>typeof value==="string"?value.trim().slice(0,max):"";
const responsibility=(value:unknown):Responsibility=>{const key=text(value).toLowerCase();if(["lead","lead-engineer"].includes(key))return"lead";if(["specialist","diagnose"].includes(key))return"diagnose";if(["competent","independent","deliver"].includes(key))return"deliver";return"assist";};
const claim=(item:any):"support"|"independent"|"not-offered"=>{if(["support","independent","not-offered"].includes(item?.claim))return item.claim;const score=Number(item?.selfLevel??item?.rating??0);return score<=0?"not-offered":score<3?"support":"independent";};
const keywords=(profile:any)=>[...(profile.customKeywords||[]),...(profile.productTags||[]),...(profile.brandTags||[]),...(profile.platformTags||[]),...(profile.certificationTags||[])].map((item:unknown)=>text(item,80)).filter(Boolean).filter((item:string,index:number,all:string[])=>all.findIndex(value=>value.toLowerCase()===item.toLowerCase())===index).slice(0,30);
const productExperience=(input:unknown)=>Object.fromEntries(Object.entries(input&&typeof input==="object"?input:{}).map(([product,value])=>[text(product,80),text(value,40).toLowerCase()]).filter(([product,value])=>Boolean(product&&value)).slice(0,40));

export function canonicaliseEngineerProfile(profile:Record<string,unknown>):CanonicalEngineerProfileDTO{
  const source:any[]=Array.isArray(profile.roleSkillProfiles)?profile.roleSkillProfiles:Array.isArray(profile.capabilityProfiles)?profile.capabilityProfiles:Array.isArray(profile.roleProfiles)?profile.roleProfiles:[];
  const capabilityProfiles=source.filter(Boolean).map((item:any)=>{
    const roleId=normaliseRoleId(text(item.roleId||item.expectationId));
    if(!roleId)throw new Error("Engineer profile contains a non-canonical specialist role.");
    const raw:any[]=Array.isArray(item.capabilities)?item.capabilities:Array.isArray(item.skills)?item.skills:Array.isArray(item.ratings)?item.ratings:[];
    const seen=new Set<string>();
    const capabilities=raw.map((skill:any)=>({skillId:text(skill.skillId||skill.skill||skill.name,120),claim:claim(skill),evidenceNote:text(skill.evidenceNote||skill.evidence,500)})).filter((entry:{skillId:string})=>entry.skillId&&!seen.has(entry.skillId.toLowerCase())&&seen.add(entry.skillId.toLowerCase())).slice(0,80);
    return{roleId,overallCapability:responsibility(item.overallCapability||item.maximumResponsibility),capabilities,keywords:keywords(item),productExperience:productExperience(item.productExperience),productTags:keywords({productTags:item.productTags}),brandTags:keywords({brandTags:item.brandTags}),platformTags:keywords({platformTags:item.platformTags}),certificationTags:keywords({certificationTags:item.certificationTags}),customKeywords:keywords({customKeywords:item.customKeywords}),evidence:(Array.isArray(item.evidence)?item.evidence:[]).slice(0,20),profileNote:text(item.profileNote||item.profileNotes,2000)};
  });
  return{...profile,profileSchemaVersion:ENGINEER_PROFILE_SCHEMA_VERSION,capabilityProfiles,roleSkillProfiles:capabilityProfiles};
}

const jobInput=z.record(z.unknown()).refine(value=>typeof value.title==="string"&&value.title.trim().length>=3,{message:"A job title is required."});
export function canonicaliseJob(input:unknown):CanonicalJobDTO{
  const parsed=jobInput.parse(input);const requestedExpectationId=text(parsed.roleId);
  const rawNeeds:any[]=Array.isArray(parsed.engineerNeeds)?parsed.engineerNeeds:[];
  const requested:any[]=rawNeeds.length?rawNeeds:[{expectationId:parsed.roleId,workingArrangement:parsed.workingArrangement,skills:parsed.skillRequirements,prerequisites:parsed.prerequisites,quantity:1}];
  const roleRequirements=requested.map((need:any)=>{
    const roleId=normaliseRoleId(text(need.roleId||need.expectationId));if(!roleId)throw new Error("Choose a canonical AV or IT job role.");
    const skills=(Array.isArray(need.skills)?need.skills:[]).map((item:any)=>({skillId:text(item.skillId||item.skill||item.name,120),required:Boolean(item.required??item.isRequired??true)})).filter((entry:{skillId:string})=>entry.skillId).slice(0,40);
    const prerequisites=(Array.isArray(need.prerequisites)?need.prerequisites:[]).map((item:any)=>({label:text(typeof item==="string"?item:item.label,120),category:text(item?.category||"software-manufacturer-hardware",60),minimumExperience:text(item?.minimumExperience||"practical",60)})).filter((entry:{label:string})=>entry.label).slice(0,3);
    return{roleId,quantity:Math.max(1,Math.min(100,Number(need.quantity)||1)),responsibility:responsibility(need.workingArrangement||need.responsibility),skills,prerequisites};
  });
  const roleIds=[...new Set(roleRequirements.map((item:{roleId:string})=>item.roleId))];
  return{...parsed,jobSchemaVersion:JOB_SCHEMA_VERSION,title:text(parsed.title,160),requestedExpectationId,roleId:roleIds[0],roleIds,roleRequirements,skillRequirements:roleRequirements.flatMap((item:any)=>item.skills.map((skill:any)=>({...skill,roleId:item.roleId}))),prerequisites:roleRequirements.flatMap((item:any)=>item.prerequisites)};
}
