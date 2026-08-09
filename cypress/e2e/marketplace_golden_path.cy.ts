describe('persisted marketplace browser journey', () => {
  const api = 'http://localhost:4100/api';
  const email = `browser-company-${Date.now()}@techsubbies.test`;
  const engineerEmail = `browser-engineer-${Date.now()}@techsubbies.test`;
  const password = 'correcthorsebattery';

  before(() => {
    cy.request('POST', `${api}/auth/register`, {
      email, password, role: 'Company', name: 'Browser Test Company',
      profileData: { companyName: 'Browser Test Company' },
    }).then(({ body: company }) => {
      cy.clearCookies();
      cy.request('POST', `${api}/auth/register`, {
        email: engineerEmail, password, role: 'Engineer', name: 'Browser Test Engineer',
        profileData: { discipline: 'AV' },
      }).then(({ body: engineer }) => {
        cy.clearCookies();
        cy.request({
          method: 'POST', url: `${api}/jobs`,
          headers: { Authorization: `Bearer ${company.token}` },
          body: {
            title: 'Persisted browser AVoIP role',
            description: 'Commission and validate an enterprise AVoIP deployment.',
            location: 'London', dayRate: '550', duration: '3 months', currency: 'GBP',
            jobType: 'Contract', experienceLevel: 'Senior', jobRole: 'AV Installation Engineer',
            canonicalRoleId: 'free-basic-av-installation-engineer',
          },
        }).then(({ body: job }) => {
          cy.clearCookies();
          cy.request({
            method: 'POST', url: `${api}/jobs/${job.id}/apply`,
            headers: { Authorization: `Bearer ${engineer.token}` }, body: {},
          });
        });
      });
    });
  });

  it('signs in through the UI and hydrates the company job from SQLite', () => {
    cy.visit('/login');
    cy.get('input[autocomplete="username"]').clear().type(email);
    cy.get('input[autocomplete="current-password"]').clear().type(password, { log: false });
    cy.contains('button', 'Sign in').click();
    cy.contains('h1', 'Welcome, Browser Test Company!', { timeout: 10000 }).should('be.visible');
    cy.contains('button', 'My Jobs').click();
    cy.contains('h3', 'Persisted browser AVoIP role').should('be.visible');
    cy.contains('button', 'View Applicants').click();
    cy.contains('Browser Test Engineer', { timeout: 10000 }).should('be.visible');
  });
});
