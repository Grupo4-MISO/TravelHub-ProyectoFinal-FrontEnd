export class HotelPage {
    static getReservasManager() {
        return cy.get('[data-cy="reservas-header"]').should('be.visible');
    }

    static clickBuscarReservas(){
        return cy.get('[data-cy="canvas-buscar"]').click({ force: true});
    }
}