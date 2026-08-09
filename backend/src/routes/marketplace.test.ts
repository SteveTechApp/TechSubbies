import path from "node:path";
import { randomUUID } from "node:crypto";
import { describe, it, expect } from "vitest";
import request from "supertest";

process.env.DB_FILE = path.join(process.cwd(), "data", `test-marketplace-${randomUUID()}.db`);
process.env.JWT_SECRET = "test-secret";
const { createApp } = await import("../app.js");
const app = createApp();

async function register(email: string, role: string, profileData: Record<string,unknown> = {}) {
  const response = await request(app).post('/api/auth/register').send({ email, password: 'correcthorsebattery', role, name: email.split('@')[0], profileData });
  return { token: response.body.token as string, id: response.body.user.id as string };
}
const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

describe('secured marketplace golden path', () => {
  it('persists job, application, signed contract and approved timesheet without job payments', async () => {
    const company = await register('company@market.test', 'Company');
    const engineer = await register('engineer@market.test', 'Engineer', { availabilityConfirmedAt:new Date().toISOString(), roleSkillProfiles:[{roleId:'avoip-commissioning-engineer',overallCapability:'deliver',capabilities:[{skillId:'validate-igmp',claim:'independent'}],productExperience:{'Q-SYS':'configured'},evidence:[{type:'project'}]}] });
    const job = await request(app).post('/api/jobs').set(auth(company.token)).send({ title: 'AVoIP commissioning', roleId: 'avoip-commissioning-engineer', prerequisites: ['Q-SYS configured experience'], skillRequirements: [{ skillId: 'validate-igmp', minimumRating: 4 }] });
    expect(job.status).toBe(201);
    expect(job.body.roleId).toBe('avoip-commissioning-engineer');
    const application = await request(app).post(`/api/jobs/${job.body.id}/apply`).set(auth(engineer.token)).send({ coverNote: 'Relevant commissioning evidence available.' });
    expect(application.status).toBe(201);
    const shortlist=await request(app).get(`/api/jobs/${job.body.id}/shortlist`).set(auth(company.token));
    expect(shortlist.status).toBe(200);
    expect(shortlist.body.candidates[0]).toMatchObject({engineerId:engineer.id,outcome:'eligible',roleMatch:true,responsibilityFit:true,matchedPrerequisites:['Q-SYS configured experience'],matchedSkills:['validate-igmp']});
    expect(shortlist.body.candidates[0].engineerEmail).toBeUndefined();
    expect((await request(app).get(`/api/jobs/${job.body.id}/shortlist`).set(auth(engineer.token))).status).toBe(403);
    expect((await request(app).post(`/api/jobs/${job.body.id}/apply`).set(auth(engineer.token)).send({})).status).toBe(409);
    const contract = await request(app).post('/api/contracts').set(auth(company.token)).send({ applicationId: application.body.id, scope: 'Commission and hand over system' });
    expect(contract.status).toBe(201);
    expect((await request(app).get(`/api/contracts/${contract.body.id}/contacts`).set(auth(company.token))).status).toBe(409);
    expect((await request(app).get('/api/applications').set(auth(company.token))).body.find((item:any)=>item.id===application.body.id).status).toBe('Offered');
    const companySigned = await request(app).post(`/api/contracts/${contract.body.id}/sign`).set(auth(company.token));
    expect(companySigned.body.status).toBe('Pending Signature');
    const engineerSigned = await request(app).post(`/api/contracts/${contract.body.id}/sign`).set(auth(engineer.token));
    expect(engineerSigned.body.status).toBe('Active');
    expect((await request(app).post(`/api/contracts/${contract.body.id}/sign`).set(auth(engineer.token))).status).toBe(409);
    expect((await request(app).get('/api/applications').set(auth(engineer.token))).body.find((item:any)=>item.id===application.body.id).status).toBe('Hired');
    const engineerContact = await request(app).get(`/api/contracts/${contract.body.id}/contacts`).set(auth(company.token));
    expect(engineerContact.body.contact.email).toBe('engineer@market.test');
    const companyContact = await request(app).get(`/api/contracts/${contract.body.id}/contacts`).set(auth(engineer.token));
    expect(companyContact.body.contact.email).toBe('company@market.test');
    const workPackPayload = { roleId: 'avoip-commissioning-engineer', responsibility: 'Commission independently', scope: 'Commission, test and document the complete AVoIP system.', exclusions: ['Network switch replacement'], prerequisites: ['Q-SYS configured experience'], siteContact: 'Sam Site 07000000000', escalationContact: 'Alex PM 07000000001', completionEvidence: ['Commissioning results', 'Handover sign-off'] };
    const workPack = await request(app).put(`/api/trust/contracts/${contract.body.id}/work-pack`).set(auth(company.token)).send(workPackPayload);
    expect(workPack.body.version).toBe(1);
    expect(workPack.body.paymentNotice).toContain('directly between the parties');
    expect((await request(app).get(`/api/trust/contracts/${contract.body.id}/work-pack`).set(auth(engineer.token))).body.scope).toContain('Commission');
    const time = await request(app).post(`/api/contracts/${contract.body.id}/timesheets`).set(auth(engineer.token)).send({ period: '2026-W32', hours: 8, workSummary: 'Commissioning complete' });
    expect(time.status).toBe(201);
    expect((await request(app).post(`/api/contracts/${contract.body.id}/complete`).set(auth(company.token))).status).toBe(409);
    expect((await request(app).patch(`/api/timesheets/${time.body.id}`).set(auth(company.token)).send({ status: 'approved' })).body.status).toBe('approved');
    expect((await request(app).patch(`/api/timesheets/${time.body.id}`).set(auth(company.token)).send({ status: 'rejected' })).status).toBe(409);
    const completed = await request(app).post(`/api/contracts/${contract.body.id}/complete`).set(auth(company.token));
    expect(completed.body.status).toBe('Completed');
    expect((await request(app).put(`/api/trust/contracts/${contract.body.id}/work-pack`).set(auth(company.token)).send(workPackPayload)).status).toBe(409);
    const validation = await request(app).post(`/api/trust/contracts/${contract.body.id}/validation`).set(auth(company.token)).send({ roleId: 'avoip-commissioning-engineer', responsibilityMet: true, capabilitiesObserved: ['validate-igmp'], unexpectedSupervisionRequired: false, wouldUseAgainForRole: true });
    expect(validation.status).toBe(201);
    expect((await request(app).post(`/api/trust/contracts/${contract.body.id}/validation`).set(auth(company.token)).send({ roleId: 'avoip-commissioning-engineer', responsibilityMet: true, capabilitiesObserved: [], unexpectedSupervisionRequired: false, wouldUseAgainForRole: true })).status).toBe(409);
    const validations = await request(app).get(`/api/trust/engineers/${engineer.id}/validations`).set(auth(engineer.token));
    expect(validations.body).toHaveLength(1);
    const insights = await request(app).get('/api/trust/insights').set(auth(company.token));
    expect(insights.body.totals).toMatchObject({ jobs: 1, applications: 1, contracts: 1, completedContracts: 1, validations: 1, positiveValidations: 1 });
    expect(insights.body.roleDemand[0]).toEqual({ roleId: 'avoip-commissioning-engineer', count: 1 });
    expect(insights.body.privacyNotice).toContain('aggregated');
    expect((await request(app).get('/api/trust/audit').set(auth(company.token))).body.some((event:any)=>event.action==='read.contract-contact')).toBe(true);
    const membershipInvoice=await request(app).post('/api/membership/invoices').set(auth(engineer.token)).send({ plan: 'professional' });expect(membershipInvoice.body.amountPence).toBe(700);
    expect((await request(app).post('/api/membership/invoices').set(auth(engineer.token)).send({ plan: 'professional' })).status).toBe(409);
    expect((await request(app).post('/api/membership/invoices').set(auth(company.token)).send({ plan: 'business' })).status).toBe(403);
    expect((await request(app).post('/api/payments/create-intent').set(auth(company.token)).send({ amount: 50000 })).status).toBe(404);
  });

  it('enforces role and ownership boundaries', async () => {
    const engineer = await register('blocked@market.test', 'Engineer');
    expect((await request(app).post('/api/jobs').set(auth(engineer.token)).send({ title: 'Invalid', roleId: 'network-engineer' })).status).toBe(403);
    expect((await request(app).put(`/api/trust/talent-pool/${engineer.id}`).set(auth(engineer.token)).send({ list: 'preferred' })).status).toBe(403);
    expect((await request(app).get('/api/trust/insights').set(auth(engineer.token))).status).toBe(403);
    expect((await request(app).get('/api/contracts')).status).toBe(401);
  });

  it('normalises responsibility templates to professions and rejects skills as roles',async()=>{const company=await register('taxonomy@market.test','Company');const alias=await request(app).post('/api/jobs').set(auth(company.token)).send({title:'Senior installation delivery',roleId:'senior-av-installer'});expect(alias.status).toBe(201);expect(alias.body.roleId).toBe('av-installation-engineer');expect(alias.body.requestedExpectationId).toBe('senior-av-installer');expect((await request(app).post('/api/jobs').set(auth(company.token)).send({title:'Wrong classification',roleId:'Q-SYS programming'})).status).toBe(400);expect((await request(app).get('/api/roles')).body.roleIds).toContain('software-developer');});

  it('persists one canonical requirements schema for multi-role jobs',async()=>{const company=await register('canonical-job@market.test','Company');const response=await request(app).post('/api/jobs').set(auth(company.token)).send({title:'AV deployment team',roleId:'av-installation-engineer',engineerNeeds:[{expectationId:'senior-av-installer',quantity:2,workingArrangement:'lead',skills:[{skill:'rack testing',isRequired:true}],prerequisites:['Crestron hardware experience']},{expectationId:'network-engineer',quantity:1,workingArrangement:'independent',skills:[{skill:'VLAN configuration',isRequired:true}],prerequisites:['Cisco Catalyst configuration']} ]});expect(response.status).toBe(201);expect(response.body.jobSchemaVersion).toBe(2);expect(response.body.roleIds).toEqual(['av-installation-engineer','network-engineer']);expect(response.body.roleRequirements[0]).toMatchObject({roleId:'av-installation-engineer',quantity:2,responsibility:'lead'});expect(response.body.roleRequirements[0].prerequisites[0]).toEqual({label:'Crestron hardware experience',category:'software-manufacturer-hardware',minimumExperience:'practical'});expect(response.body.prerequisites).toHaveLength(2);});

  it('hard-excludes an applicant who lacks a mandatory prerequisite and requires a recorded override',async()=>{const company=await register('shortlist-company@market.test','Company');const engineer=await register('shortlist-engineer@market.test','Engineer',{availabilityConfirmedAt:new Date().toISOString(),roleSkillProfiles:[{roleId:'av-control-systems-programmer',overallCapability:'lead',capabilities:[{skillId:'control-programming',claim:'independent'}],productExperience:{Crestron:'programmed'}}]});const job=await request(app).post('/api/jobs').set(auth(company.token)).send({title:'Q-SYS control programmer',roleId:'av-control-systems-programmer',prerequisites:['Q-SYS programmed experience'],skillRequirements:[{skillId:'control-programming'}]});const application=await request(app).post(`/api/jobs/${job.body.id}/apply`).set(auth(engineer.token)).send({});const shortlist=await request(app).get(`/api/jobs/${job.body.id}/shortlist`).set(auth(company.token));expect(shortlist.body.candidates[0]).toMatchObject({outcome:'excluded',missingPrerequisites:['Q-SYS programmed experience'],roleMatch:true});expect(shortlist.body.candidates[0].score).toBeGreaterThan(50);expect((await request(app).post('/api/contracts').set(auth(company.token)).send({applicationId:application.body.id,scope:'Control programming'})).status).toBe(409);const override=await request(app).post('/api/contracts').set(auth(company.token)).send({applicationId:application.body.id,scope:'Control programming',overrideExclusionReason:'Client has approved supervised Q-SYS delivery.'});expect(override.status).toBe(201);expect(override.body.overrideExclusionReason).toContain('Client has approved');expect(override.body.selectionAssessment.outcome).toBe('excluded');});

  it('keeps each company talent pool private and restricted to engineer profiles', async () => {
    const companyA = await register('pool-a@market.test', 'Company');
    const companyB = await register('pool-b@market.test', 'Company');
    const engineer = await register('pool-engineer@market.test', 'Engineer');
    expect((await request(app).put(`/api/trust/talent-pool/${engineer.id}`).set(auth(companyA.token)).send({ list: 'preferred', approvedRoleIds: ['network-engineer'], privateNotes: 'Strong client feedback' })).status).toBe(200);
    expect((await request(app).put(`/api/trust/talent-pool/${companyB.id}`).set(auth(companyA.token)).send({ list: 'preferred' })).status).toBe(404);
    expect((await request(app).get('/api/trust/talent-pool').set(auth(companyA.token))).body).toHaveLength(1);
    expect((await request(app).get('/api/trust/talent-pool').set(auth(companyB.token))).body).toHaveLength(0);
    expect((await request(app).delete(`/api/trust/talent-pool/${engineer.id}`).set(auth(companyA.token))).status).toBe(204);
    const team = await request(app).post('/api/trust/teams').set(auth(companyA.token)).send({ name: 'AV commissioning crew', requiredRoleIds: ['av-lead-engineer','network-engineer'], members: [{ engineerId: engineer.id, roleIds: ['av-lead-engineer','network-engineer'] }] });
    expect(team.status).toBe(201);
    expect((await request(app).get('/api/trust/teams').set(auth(companyA.token))).body).toHaveLength(1);
    expect((await request(app).get('/api/trust/teams').set(auth(companyB.token))).body).toHaveLength(0);
    expect((await request(app).post('/api/trust/teams').set(auth(companyA.token)).send({ name: 'Invalid company member', requiredRoleIds: ['av-lead-engineer'], members: [{ engineerId: companyB.id, roleIds: ['av-lead-engineer'] }] })).status).toBe(400);
    const auditA = await request(app).get('/api/trust/audit').set(auth(companyA.token));
    expect(auditA.body.some((event:any)=>event.entityType==='project-team')).toBe(true);
    expect(auditA.body.some((event:any)=>JSON.stringify(event.metadata).includes('Strong client feedback'))).toBe(false);
    expect((await request(app).get('/api/trust/audit').set(auth(companyB.token))).body).toHaveLength(0);
    expect((await request(app).get('/api/trust/audit').set(auth(engineer.token))).status).toBe(403);
  });
});
