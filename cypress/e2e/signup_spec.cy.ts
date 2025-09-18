// FIX: Added a triple-slash directive to include Cypress's type definitions.
/// <reference types="cypress" />

describe('Engineer Signup Flow', () => {
  it('allows a new engineer to sign up and redirects to the dashboard', () => {
    cy.visit('/');

    // Go to login/signup page
    cy.contains('Login / Sign Up').click();
    cy.url().should('include', 'login');

    // Click signup as engineer
    cy.contains('Sign up as Engineer').click();
    cy.url().should('include', 'engineerSignUp');

    // --- Step 1: Core Info ---
    cy.get('input[name="name"]').type('Cypress Test Engineer');
    cy.get('input[name="email"]').type('cypress.test@example.com');
    // Other fields have defaults, we'll skip them for simplicity
    cy.contains('Next').click();

    // --- Step 2: Work Readiness ---
    cy.get('input[name="hasOwnTransport"]').check();
    cy.get('input[name="cscsCard"]').check();
    cy.contains('Next').click();
    
    // --- Step 3: Identity ---
    // Skip optional identity step
    cy.contains('Next').click();

    // --- Step 4: Rate & Availability ---
    cy.get('input[name="minDayRate"]').clear().type('180');
    cy.get('input[name="maxDayRate"]').clear().type('190');

    // Finish signup
    cy.contains('Finish & Create Profile').click();

    // --- Assert we are on the dashboard ---
    cy.url().should('include', 'engineerDashboard');
    cy.contains('Welcome, Cypress!').should('be.visible');
  });
});