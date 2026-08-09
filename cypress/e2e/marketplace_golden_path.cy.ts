describe('persisted marketplace browser journey', () => {
  const api='http://localhost:4100/api';
  const email=`browser-company-${Date.now()}@techsubbies.test`;
  const engineerEmail=`browser-engineer-${Date.now()}@techsubbies.test`;
  const password='correcthorsebattery';
  let companyToken='';
  let contractId='';

  before(() => {
    cy.request('POST',`${api}/auth/register`,{email,password,role:'Company',name:'Browser Test Company',profileData:{companyName:'Browser Test Company'}}).then(({body})=>{
      companyToken=body.token;
      cy.request('POST',`${api}/auth/register`,{email:engineerEmail,password,role:'Engineer',name:'Browser Test Engineer',profileData:{discipline:'AV',availabilityConfirmedAt:new Date().toISOString(),roleSkillProfiles:[{roleId:'avoip-commissioning-engineer',overallCapability:'deliver',capabilities:[{skillId:'validate-igmp',claim:'independent'}],productExperience:{'Q-SYS':'configured'},evidence:[{type:'project'}]}]}}).then(({body:engineer})=>{
        cy.request({method:'POST',url:`${api}/jobs`,headers:{Authorization:`Bearer ${companyToken}`},body:{title:'Persisted browser AVoIP role',roleId:'avoip-commissioning-engineer',location:'London',prerequisites:['Q-SYS configured experience'],skillRequirements:[{skillId:'validate-igmp'}]}}).then(({body:job})=>{
          cy.request({method:'POST',url:`${api}/jobs/${job.id}/apply`,headers:{Authorization:`Bearer ${engineer.token}`},body:{coverNote:'Browser golden-path application'}});
        });
      });
    });
  });

  it('signs in through the UI and hydrates the company job from SQLite', () => {
    cy.visit('/login');
    cy.get('input[autocomplete="username"]').clear().type(email);
    cy.get('input[autocomplete="current-password"]').clear().type(password,{log:false});
    cy.contains('button','Sign in').click();
    cy.contains('h1','Welcome, Browser Test Company!',{timeout:10000}).should('be.visible');
    cy.contains('button','My Jobs').click();
    cy.contains('h3','Persisted browser AVoIP role').should('be.visible');
    cy.contains('button','View Applicants').click();
    cy.contains('h3','Explainable shortlist').should('be.visible');
    cy.contains('article','Browser Test Engineer').contains(/eligible/i).should('be.visible');
    cy.contains('button','Select & Send Contract').click();
    cy.contains('h2','Create Contract').should('be.visible');
    cy.contains('label','Contract Type').parent().find('select').select('Day Rate');
    cy.intercept('POST','**/api/contracts').as('createContract');
    cy.contains('button','Send for Signature').click();
    cy.wait('@createContract').its('response.statusCode').should('equal',201);
    cy.request({url:`${api}/contracts`,headers:{Authorization:`Bearer ${companyToken}`}}).its('body').should((contracts:any[])=>{
      expect(contracts).to.have.length(1);
      expect(contracts[0].status).to.equal('Pending Signature');
      expect(contracts[0].roleId).to.equal('avoip-commissioning-engineer');
      contractId=contracts[0].id;
    });
    cy.contains('Membership Invoices').should('be.visible');

    cy.clearLocalStorage();cy.visit('/login');
    cy.get('input[autocomplete="username"]').clear().type(engineerEmail);
    cy.get('input[autocomplete="current-password"]').clear().type(password,{log:false});
    cy.contains('button','Sign in').click();
    cy.contains('button','Contracts',{timeout:10000}).click();
    cy.contains('button','Persisted browser AVoIP role').click();
    cy.contains('button','Review & Sign Contract').click();
    cy.get('#agree-terms').check();
    cy.get('input[placeholder="Type your full name to sign"]').type('Browser Test Engineer');
    cy.get('[data-testid="contract-sign-submit"]').click();
    cy.contains('Engineer Signature').parent().contains('Signed by Browser Test Engineer',{timeout:10000}).should('be.visible');

    cy.clearLocalStorage();cy.visit('/login');
    cy.get('input[autocomplete="username"]').clear().type(email);
    cy.get('input[autocomplete="current-password"]').clear().type(password,{log:false});
    cy.contains('button','Sign in').click();
    cy.contains('button','Contracts',{timeout:10000}).click();
    cy.contains('button','Persisted browser AVoIP role').click();
    cy.contains('button','Countersign & Activate').click();
    cy.get('#agree-terms').check();
    cy.get('input[placeholder="Type your full name to sign"]').type('Browser Test Company');
    cy.get('[data-testid="contract-sign-submit"]').click();
    cy.contains('Active & In Progress',{timeout:10000}).scrollIntoView().should('be.visible');
    cy.request({url:`${api}/contracts`,headers:{Authorization:`Bearer ${companyToken}`}}).its('body').should((contracts:any[])=>{
      const contract=contracts.find(item=>item.id===contractId);expect(contract.status).to.equal('Active');expect(Object.keys(contract.signatures)).to.have.length(2);
    });

    cy.clearLocalStorage();cy.visit('/login');
    cy.get('input[autocomplete="username"]').clear().type(engineerEmail);
    cy.get('input[autocomplete="current-password"]').clear().type(password,{log:false});
    cy.contains('button','Sign in').click();
    cy.contains('button','Contracts',{timeout:10000}).click();
    cy.contains('button','Persisted browser AVoIP role').click();
    cy.contains('button','Submit Timesheet').click();
    cy.get('#period').type('2026-W32');cy.get('#hours').clear().type('8');cy.get('#work-summary').type('AVoIP commissioning and IGMP validation completed');
    cy.intercept('POST','**/contracts/*/timesheets').as('submitTimesheet');cy.contains('button','Submit for Approval').click();cy.wait('@submitTimesheet').its('response.statusCode').should('equal',201);
    cy.contains('2026-W32').should('be.visible');cy.contains('Submitted').should('be.visible');

    cy.clearLocalStorage();cy.visit('/login');
    cy.get('input[autocomplete="username"]').clear().type(email);
    cy.get('input[autocomplete="current-password"]').clear().type(password,{log:false});
    cy.contains('button','Sign in').click();cy.contains('button','Contracts',{timeout:10000}).click();cy.contains('button','Persisted browser AVoIP role').click();
    cy.intercept('PATCH','**/timesheets/*').as('approveTimesheet');cy.contains('button','Approve Time').click();cy.wait('@approveTimesheet').its('response.statusCode').should('equal',200);cy.contains('Approved').should('be.visible');
    cy.intercept('POST','**/contracts/*/complete').as('completeContract');cy.contains('button','Mark Assignment Complete').click();cy.wait('@completeContract').its('response.statusCode').should('equal',200);
    cy.contains('Completed').scrollIntoView().should('be.visible');
    cy.get('input[placeholder="Capabilities observed, comma separated"]').type('validate-igmp');
    cy.intercept('POST','**/trust/contracts/*/validation').as('saveValidation');cy.contains('button','Save validation').click();cy.wait('@saveValidation').its('response.statusCode').should('equal',201);cy.contains('Technical completion validation saved.').should('be.visible');
  });
});
