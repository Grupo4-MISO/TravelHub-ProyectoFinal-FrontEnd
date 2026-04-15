export class PropertyDetail {
    static selectPropertyDetail() {
        return cy.get('[data-cy="ver-detalle"]').first().click({ force: true });
    }

    static getPropertyName(property_name: string) {
        return cy.get('[data-cy="property-info"]').should('include.text', property_name);
    }
}