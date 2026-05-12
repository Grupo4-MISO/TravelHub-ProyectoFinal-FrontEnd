export class PaymentPage {
    static viewPaymentSummary() {
        return cy.get('[data-cy="tarifa-reserva"]').should('be.visible');
    }

    static viewReservationDetails() {
        return cy.get('[data-cy="reserva-detalles"]').should('be.visible');
    }

    static selectPaymentMethod(method: string){
        return cy.get(`[data-cy="payment-method-${method}"]`).should('be.visible').should('be.visible').click({ force: true })
    }

    static confirmarReserva(){
        return cy.get('[data-cy="confirmar-reserva"]').click({ force: true });
    }
}