// https://on.cypress.io/api

describe('My First Test', () => {
  it('visits the app root url', () => {
    cy.visit('/example/v-timeline.html')
    // you must see "Event start", "Approved", "Success"  string in the page
    cy.contains('Event start').should('be.visible')
    cy.contains('Approved').should('be.visible')
    cy.contains('Success').should('be.visible')
    // you must see "2018-04-15", "2018-04-13", "2018-04-11" with style  color: gray; and font-size: 12px;
    cy.contains('2018-04-15').should('have.css', 'color', 'rgb(128, 128, 128)')
    cy.contains('2018-04-15').should('have.css', 'font-size', '12px')
    cy.contains('2018-04-13').should('have.css', 'color', 'rgb(128, 128, 128)')
    cy.contains('2018-04-13').should('have.css', 'font-size', '12px')
    cy.contains('2018-04-11').should('have.css', 'color', 'rgb(128, 128, 128)')
    cy.contains('2018-04-11').should('have.css', 'font-size', '12px')
  })
})
