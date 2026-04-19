export class SearchBar {
    static selectDestination(destination: string){
        //Escribimos el destino para desplegar el dropdown
        cy.get('[formControlName="ciudad"]').type(destination.substring(0, 3));
        
        //Seleccionamos el destino del dropdown
        cy.get('.dropdown')
        .should('be.visible')
        .contains('.dropdown-item', destination)
        .click();
    }

    static selectCheckInDate(check_in: string){
        return cy.get('[data-cy="check-in"]').invoke('val', check_in).trigger('input').trigger('change');
    }

    static selectCheckOutDate(check_out: string){
        return cy.get('[data-cy="check-out"]').invoke('val', check_out).trigger('input').trigger('change');
    }

    static selectHuespedes(huespedes: number){
        return cy.get('[data-cy="guests"]').invoke('val', huespedes).trigger('input').trigger('change');
    }

    static clickSearchButton(){
        return cy.get('[data-cy="search"]').click({ force: true });
    }
}