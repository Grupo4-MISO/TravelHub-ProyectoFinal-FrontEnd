export class Toastr {
    static getToastrMessage(message: string){
        return cy.get('.toast-success', { timeout: 10000 })
        .should('be.visible')
        .and('contain', message);
    }
}