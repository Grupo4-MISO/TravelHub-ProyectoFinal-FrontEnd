export class Toastr {
    static getToastrMessage(){
        return cy.get('.toast-success', { timeout: 10000 })
        .should('be.visible')
        .and('contain', 'Hospedajes encontrados');
    }
}