import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { activateContract, createAuditEvent, findUserById, listUsers, createJob, getJob, listJobs, createApplication, getApplication, listApplicationsForJob, listApplicationsForUser, updateApplicationStatus, createContract, getContract, listContractsForUser, updateContract, createTimesheet, getTimesheet, listTimesheets, updateTimesheetStatus, createMembershipInvoice, listMembershipInvoices } from "../lib/db.js";
import { listCanonicalRoleIds, normaliseRoleId } from "../domain/roleCatalog.js";
import { assessApplicant, buildShortlist } from "../domain/shortlist.js";
import { canonicaliseJob } from "../domain/marketplaceSchema.js";
import type { MarketplaceApplicationDTO, PersistedJobDTO, ShortlistResponseDTO } from "../domain/marketplaceTypes.js";

export const marketplaceRouter = Router();
const profileRole = (id: string) => findUserById(id)?.role;

marketplaceRouter.use((req:AuthedRequest,res,next)=>{res.on('finish',()=>{if(!req.userId||!['POST','PUT','PATCH','DELETE'].includes(req.method)||res.statusCode<200||res.statusCode>=300)return;const parts=req.path.split('/').filter(Boolean);let contract:any;const contractIndex=parts.indexOf('contracts');if(contractIndex>=0&&parts[contractIndex+1])contract=getContract(parts[contractIndex+1]);const timesheetIndex=parts.indexOf('timesheets');if(!contract&&timesheetIndex>=0&&parts[timesheetIndex+1]){const sheet:any=getTimesheet(parts[timesheetIndex+1]);if(sheet)contract=getContract(sheet.contractId);}const jobIndex=parts.indexOf('jobs');const job:any=jobIndex>=0&&parts[jobIndex+1]?getJob(parts[jobIndex+1]):undefined;const companyId=contract?.companyId||job?.companyId||req.userId;const entityType=parts.includes('membership')?'membership-invoice':parts.includes('timesheets')?'timesheet':parts.includes('contracts')?'contract':parts.includes('applications')||parts.includes('apply')?'application':parts.includes('jobs')?'job':'marketplace-record';createAuditEvent(companyId,req.userId,`${req.method.toLowerCase()}.${entityType}`,entityType,contract?.id||job?.id||parts[parts.length-1]||'new',{statusCode:res.statusCode});});next();});

marketplaceRouter.get("/jobs", (_req, res) => res.json(listJobs()));
marketplaceRouter.get("/roles", (_req,res)=>res.json({roleIds:listCanonicalRoleIds()}));
marketplaceRouter.post("/jobs", requireAuth, (req: AuthedRequest, res) => {
  if (!['Company', 'Resourcing Company'].includes(profileRole(req.userId!) || '')) return res.status(403).json({ error: 'Only companies can post jobs.' });
  try{const job=canonicaliseJob(req.body);return res.status(201).json(createJob(req.userId!,{...job,companyId:req.userId!}));}catch(error){return res.status(400).json({error:error instanceof Error?error.message:'Invalid job details.'});}
});
marketplaceRouter.get("/applications", requireAuth, (req: AuthedRequest, res) => res.json(listApplicationsForUser(req.userId!)));
marketplaceRouter.get("/jobs/:jobId/shortlist",requireAuth,(req:AuthedRequest,res)=>{const job=getJob(req.params.jobId) as PersistedJobDTO|undefined;if(!job)return res.status(404).json({error:'Job not found.'});if(job.companyId!==req.userId)return res.status(403).json({error:'Only the hiring company can view this shortlist.'});const applications=listApplicationsForJob(job.id) as unknown as MarketplaceApplicationDTO[];const response:ShortlistResponseDTO={job:{id:job.id,title:job.title,roleId:job.roleId},generatedAt:new Date().toISOString(),method:'Rules-based explanation from declared profile data; no hidden AI inference.',candidates:buildShortlist(job,applications,listUsers())};return res.json(response);});
marketplaceRouter.post("/jobs/:jobId/apply", requireAuth, (req: AuthedRequest, res) => {
  if (profileRole(req.userId!) !== 'Engineer') return res.status(403).json({ error: 'Only engineers can apply.' });
  const job: any = getJob(req.params.jobId); if (!job || job.status !== 'active') return res.status(404).json({ error: 'Active job not found.' });
  try { return res.status(201).json(createApplication(job.id, req.userId!, { ...(req.body || {}), jobId: job.id, engineerId: req.userId! })); } catch { return res.status(409).json({ error: 'You have already applied.' }); }
});
marketplaceRouter.patch("/applications/:id", requireAuth, (req: AuthedRequest, res) => {
  const application: any = getApplication(req.params.id); const job: any = application && getJob(application.jobId);
  if (!application) return res.status(404).json({ error: 'Application not found.' });
  if (job?.companyId !== req.userId!) return res.status(403).json({ error: 'Only the hiring company can update this application.' });
  const status = String(req.body?.status || ''); if (!['Viewed','Offered','Hired','Rejected'].includes(status)) return res.status(400).json({ error: 'Invalid application status.' });
  return res.json(updateApplicationStatus(application.id, status));
});
marketplaceRouter.get("/contracts", requireAuth, (req: AuthedRequest, res) => res.json(listContractsForUser(req.userId!)));
marketplaceRouter.get("/contracts/:id/contacts",requireAuth,(req:AuthedRequest,res)=>{const contract:any=getContract(req.params.id);if(!contract)return res.status(404).json({error:'Contract not found.'});if(![contract.companyId,contract.engineerId].includes(req.userId!))return res.status(403).json({error:'Not a contract party.'});if(!['Active','Completed'].includes(contract.status))return res.status(409).json({error:'Contact details are released after both parties sign.'});const otherId=req.userId===contract.companyId?contract.engineerId:contract.companyId;const other=findUserById(otherId);if(!other)return res.status(404).json({error:'Contract contact not found.'});let profile:any={};try{profile=JSON.parse(other.profile)}catch{}const contact=profile.contact||{};createAuditEvent(contract.companyId,req.userId!,'read.contract-contact','contract-contact',contract.id,{contactPartyId:otherId});return res.json({contractId:contract.id,partyId:otherId,name:other.name,role:other.role,contact:{email:contact.email,phone:contact.phone,linkedin:contact.linkedin,website:contact.website}});});
marketplaceRouter.post("/contracts", requireAuth, (req: AuthedRequest, res) => {
  const application: any = getApplication(String(req.body?.applicationId || '')); const job: any = application && getJob(application.jobId);
  if (!application) return res.status(404).json({ error: 'Application not found.' });
  if (job?.companyId !== req.userId!) return res.status(403).json({ error: 'Only the hiring company can create the contract.' });
  if (!['Applied','Viewed','Offered'].includes(application.status)) return res.status(409).json({ error: 'This application cannot progress to contract.' });
  const engineer=findUserById(application.engineerId);if(!engineer)return res.status(409).json({error:'The applicant account is no longer available.'});const assessment=assessApplicant(job,application,engineer);const overrideExclusionReason=typeof req.body?.overrideExclusionReason==='string'?req.body.overrideExclusionReason.trim():'';if(assessment.outcome==='excluded'&&overrideExclusionReason.length<20)return res.status(409).json({error:'This applicant is excluded by a role or mandatory prerequisite. Provide an overrideExclusionReason of at least 20 characters to proceed.',assessment});
  try { return res.status(201).json(createContract(application, req.userId!, { ...req.body, jobTitle:job.title, overrideExclusionReason:overrideExclusionReason||undefined, selectionAssessment:{outcome:assessment.outcome,score:assessment.score,risks:assessment.risks}, jobId: job.id, roleId: job.roleId, companyId: req.userId!, engineerId: application.engineerId, signatures: {} })); } catch { return res.status(409).json({ error: 'A contract already exists for this application.' }); }
});
marketplaceRouter.post("/contracts/:id/sign", requireAuth, (req: AuthedRequest, res) => {
  const contract: any = getContract(req.params.id); if (!contract) return res.status(404).json({ error: 'Contract not found.' });
  if (![contract.companyId, contract.engineerId].includes(req.userId!)) return res.status(403).json({ error: 'Not a contract party.' });
  if (contract.status !== 'Pending Signature') return res.status(409).json({ error: 'This contract is not awaiting signatures.' });
  const signatures = { ...(contract.signatures || {}), [req.userId!]: { name: findUserById(req.userId!)?.name, date: new Date().toISOString() } };
  const status = signatures[contract.companyId] && signatures[contract.engineerId] ? 'Active' : 'Pending Signature';
  const payload={ ...contract, signatures };
  return res.json(status==='Active'?activateContract(contract.id,payload):updateContract(contract.id,status,payload));
});
marketplaceRouter.get("/contracts/:id/timesheets", requireAuth, (req: AuthedRequest, res) => { const c: any = getContract(req.params.id); if (!c) return res.status(404).json({error:'Contract not found.'}); if (![c.companyId,c.engineerId].includes(req.userId!)) return res.status(403).json({error:'Not a contract party.'}); return res.json(listTimesheets(c.id)); });
marketplaceRouter.post("/contracts/:id/timesheets", requireAuth, (req: AuthedRequest, res) => { const c: any = getContract(req.params.id); if (!c) return res.status(404).json({error:'Contract not found.'}); if (c.engineerId !== req.userId!) return res.status(403).json({error:'Only the assigned engineer can submit time.'}); if (c.status !== 'Active') return res.status(409).json({error:'Contract is not active.'}); const hours = Number(req.body?.hours); if (!(hours > 0 && hours <= 168)) return res.status(400).json({error:'hours must be between 0 and 168.'}); return res.status(201).json(createTimesheet(c.id, req.userId!, {...req.body, hours})); });
marketplaceRouter.patch("/timesheets/:id", requireAuth, (req: AuthedRequest, res) => { const t: any = getTimesheet(req.params.id); const c: any = t && getContract(t.contractId); if (!t) return res.status(404).json({error:'Timesheet not found.'}); if (c?.companyId !== req.userId!) return res.status(403).json({error:'Only the hiring company can review time.'}); if(t.status!=='submitted')return res.status(409).json({error:'This timesheet has already been reviewed.'}); const status=String(req.body?.status||''); if (!['approved','rejected'].includes(status)) return res.status(400).json({error:'Invalid timesheet status.'}); return res.json(updateTimesheetStatus(t.id,status)); });
marketplaceRouter.post("/contracts/:id/complete", requireAuth, (req: AuthedRequest, res) => {
  const contract: any = getContract(req.params.id);
  if (!contract) return res.status(404).json({ error: 'Contract not found.' });
  if (contract.companyId !== req.userId!) return res.status(403).json({ error: 'Only the hiring company can complete the contract.' });
  if (contract.status !== 'Active') return res.status(409).json({ error: 'Only an active contract can be completed.' });
  const timesheets: any[] = listTimesheets(contract.id);
  if (timesheets.length > 0 && timesheets.some((timesheet) => timesheet.status !== 'approved')) return res.status(409).json({ error: 'Review all submitted timesheets before completing the contract.' });
  return res.json(updateContract(contract.id, 'Completed', { ...contract, completedAt: new Date().toISOString() }));
});

// Membership billing only. Job value, escrow, payouts and engineer invoices are intentionally absent.
marketplaceRouter.get("/membership/invoices", requireAuth, (req: AuthedRequest, res) => res.json(listMembershipInvoices(req.userId!)));
marketplaceRouter.post("/membership/invoices", requireAuth, (req: AuthedRequest, res) => {if(profileRole(req.userId!)!=='Engineer')return res.status(403).json({error:'Paid memberships are available to engineer accounts only.'});const plans: Record<string,number>={professional:700,skills:1500,business:3500}; const plan=String(req.body?.plan||''); if (!(plan in plans)) return res.status(400).json({error:'Choose a paid engineer membership plan.'});if((listMembershipInvoices(req.userId!) as any[]).some(invoice=>invoice.plan===plan&&invoice.status==='open'))return res.status(409).json({error:'An open invoice already exists for this membership plan.'});return res.status(201).json(createMembershipInvoice(req.userId!,plan,plans[plan],'GBP')); });
