export class HotelPage {
    static getReservasManager() {
        return cy.get('[data-cy="reservas-header"]').should('be.visible');
    }
}