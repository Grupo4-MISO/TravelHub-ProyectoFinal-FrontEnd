export class PaymentPage {
    static viewPaymentSummary() {
        return cy.get('[data-cy="tarifa-reserva"]').should('be.visible');
    }

    static viewReservationDetails() {
        return cy.get('[data-cy="reserva-detalles"]').should('be.visible');
    }
}