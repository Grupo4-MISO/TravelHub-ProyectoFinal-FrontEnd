export class BillingPage {
    static getPageTitle(){
        return cy.get('[data-cy="billing-page-title"]').should('be.visible').and('contain', 'Ingreso total');
    }

    static getTotalGenerated(){
        return cy.get('[data-cy="billing-page-generated"]').should('be.visible').and('contain', 'Total generado por reservas confirmadas');
    }

    static getBillingTable(){
        return cy.get('[data-cy="billing-table"]').should('be.visible');
    }
}