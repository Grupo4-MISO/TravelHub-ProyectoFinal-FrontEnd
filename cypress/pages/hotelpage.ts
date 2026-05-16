export class HotelPage {
    static getReservasManager(reservas_header: string = 'Reservas') {
        return cy.get('[data-cy="reservas-header"]').should('be.visible').and('contain', reservas_header);
    }

    static clickBuscarReservas(){
        return cy.get('[data-cy="canvas-buscar"]').click({ force: true });
    }

    static closeBuscarReservasModal(){
        return cy.get('[data-cy="canvas-volver"]').click({ force: true });
    }

    static buscarReservaPorCodigo(codigo_reserva: string){
        return cy.get('[data-cy="codigo_reserva"]').type(codigo_reserva);
    }

    static getResultadosFiltros(filter_result: string){
        return cy.get('[data-cy="resultados-filtros"]').and('contain', filter_result);
    }

    static aplicarFiltros(){
        return cy.get('[data-cy="canvas-filtros"]').click({ force: true });
    }

    static clickRemoverFiltros(){
        return cy.get('[data-cy="canvas-remover-filtros"]').click({ force: true });
    }
}