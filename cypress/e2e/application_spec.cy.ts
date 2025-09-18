// FIX: Added a triple-slash directive to include Cypress's type definitions.
/// <reference types="cypress" />

describe('Job Application Flow', () => {
  it('allows a logged-in engineer to find and apply for a job', () => {
    cy.visit('/');

    // --- Login ---
    cy.contains('Login / Sign Up').click();
    cy.contains("I'm an Engineer").click();
    
    // --- Navigate and Apply ---
    cy.url().should('include', '/engineerDashboard');
    cy.contains('Job Search').click();

    // Set up alert listener BEFORE the action
    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    // Find the job and apply
    cy.contains('Senior AV Commissioning Engineer')
      .parents('[class*="bg-white p-4"]')
      .within(() => {
        cy.contains('button', 'Apply Now').click();
      })
      .then(() => {
        // Assert the alert was shown
        expect(alertStub.getCall(0)).to.be.calledWith('Application submitted!');
      });

    // --- Verify State Change ---
    // The button should now be disabled and show "Applied"
    cy.contains('Senior AV Commissioning Engineer')
      .parents('[class*="bg-white p-4"]')
      .contains('button', 'Applied')
      .should('be.disabled');
  });
});