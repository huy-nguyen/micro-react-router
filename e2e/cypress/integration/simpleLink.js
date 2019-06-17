it('Navigation by clicking simple links should work', () => {

  cy.visit('/');

  cy.getByText(/Match result:/).should('contain', 'Success')
  cy.getByText(/Matched route ID:/).should('contain', 'home')

  cy.getByText(/Simple Link: Topic Haskell/).click();
  cy.wait(100);

  cy.url().should('eq', Cypress.config().baseUrl + '/topics/haskell');
  cy.getByText(/Match result:/).should('contain', 'Success')
  cy.getByText(/Matched route ID:/).should('contain', 'topics');
})
