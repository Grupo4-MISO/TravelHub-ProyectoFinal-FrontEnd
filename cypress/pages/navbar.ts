export class NavBar {
    static selectCountry(country: string){
        return cy.get('[data-cy="country-select"]').select(country);
    }

    static clickReservas() {
        cy.visit('/booking?mode=reservations');
    }

    static clickCrearCuenta(){
        return cy.get('[data-cy="crear-cuenta-button"]').click({ force: true });
    }

    static clickTarifas(){
        cy.visit('/tarifas');
    }
}