it('should succeeed in matching home route', () => {
  cy.visit('/')

  cy.getByText(/Match result:/).should('contain', 'Success')
  cy.getByText(/Matched route ID:/).should('contain', 'home')
  cy.queryByText(/Path Param:/, {timeout: 50}).should('not.exist');
  cy.queryByText(/Query Param:/, {timeout: 50}).should('not.exist');
})

it('should succeeed in matching simple route with no path or query params', () => {
  cy.visit('/about/me')

  cy.getByText(/Match result:/).should('contain', 'Success')
  cy.getByText(/Matched route ID:/).should('contain', 'about-me')
  cy.queryByText(/Path Param:/, {timeout: 50}).should('not.exist');
  cy.queryByText(/Query Param:/, {timeout: 50}).should('not.exist');
})

it('Should succeed in matching mandatory path params', () => {
  cy.visit('/topics/haskell')

  cy.getByText(/Match result:/).should('contain', 'Success')
  cy.getByText(/Matched route ID:/).should('contain', 'topics');
  cy.getByText(/Path Param:/).should('contain', 'topicName: haskell')
  cy.queryByText(/Query Param:/, {timeout: 50}).should('not.exist');
})

it('Should succeed in matching optional path params', () => {
  cy.visit('/about/me/works/the-mythical-man-month')

  cy.getByText(/Match result:/).should('contain', 'Success')
  cy.getByText(/Matched route ID:/).should('contain', 'about-my-works');
  cy.getByText(/Path Param:/).should('contain', 'workName: the-mythical-man-month')
  cy.queryByText(/Query Param:/, {timeout: 50}).should('not.exist');
})

it('Should succeed in matching query params', () => {
  cy.visit('/about/me/works?year=2000');

  cy.getByText(/Match result:/).should('contain', 'Success')
  cy.getByText(/Matched route ID:/).should('contain', 'about-my-works');
  cy.queryByText(/Path Param:/, {timeout: 50}).should('not.exist');
  cy.getByText(/Query Param:/).should('contain', 'year: 2000')
})

it('Should succeed in matching path and query params', () => {
  cy.visit('/about/me/works/the-art-of-computer-programming?part=1&year=2000');

  cy.getByText(/Match result:/).should('contain', 'Success')
  cy.getByText(/Matched route ID:/).should('contain', 'about-my-works');
  cy.getByText(/Path Param:/).should('contain', 'workName: the-art-of-computer-programming')
  cy.getByText(/Query Param: year:/).should('contain', 'year: 2000')
  cy.getByText(/Query Param: part/).should('contain', 'part: 1')

})

it('should FAIL in matching topics route', () => {
  cy.visit('/topics')

  cy.getByText(/Match result:/).should('contain', 'Failure')
})
