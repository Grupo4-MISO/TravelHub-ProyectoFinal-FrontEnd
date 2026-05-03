export class TravelerPage {
    static getReservasTraveler() {
        return cy.get('[data-cy="reservas-header"]').should('be.visible');
    }

    static clickReserva(){
        return cy.get('[data-cy="select-reserva"]').first().click({ force: true });
    }

    static getModalInfo(){
        return cy.get('[data-cy="modal-info"]').should('be.visible');
    }

    static clickCancelarReserva(){
        return cy.get('[data-cy="cancel-reserva"]').click({ force: true });
    }

    static getCancelTitle(message_cancel: string){
        return cy.get('[data-cy="modal-title"]').should('include.text', message_cancel);
    }

    static clickVolverModal(){
        return cy.get('[data-cy="volver-button-modal"]').should('be.visible').and('not.be.disabled').click({ force: true });
    }

    static clickVolverPanel(){
        return cy.get('[data-cy="volver-button-panel"]').click({ force: true });
    }
}