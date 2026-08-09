export type CapabilityClaim="support"|"independent"|"not-offered";
export type ResponsibilityLevel="assist"|"deliver"|"diagnose"|"lead";
export interface CanonicalCapabilityProfile{roleId:string;overallCapability:ResponsibilityLevel;capabilities:Array<{skillId:string;claim:CapabilityClaim;evidenceNote?:string}>;keywords:string[];evidence:Array<{type:string;note:string}>;profileNote:string}
export interface CanonicalRoleRequirement{roleId:string;quantity:number;responsibility:ResponsibilityLevel;skills:Array<{skillId:string;required:boolean}>;prerequisites:Array<{label:string;category:"software-manufacturer-hardware";minimumExperience:"practical"}>}
