export class TarifasPage {
    static getPageTitle(){
        return cy.get('[data-cy="tarifas-page"]').should('be.visible').and('contain', 'Tarifas creadas');
    }

    static clickBackButton(){
        return cy.get('[data-cy="volver-tarifa-button"]').should('be.visible').click();
    }

    static clickNewTarifa(){
        return cy.get('[data-cy="new-tarifa-button"]').should('be.visible').click();
    }

    static getNewTarifaTitle(){
        return cy.get('[data-cy="new-tarifa-title"]').should('be.visible').and('contain', 'Nueva tarifa');
    }

    static clickCancelarButton(){
        return cy.get('[data-cy="cancelar-tarifa-button"]').should('be.visible').click();
    }

    static clickEditTarifa(){
        return cy.get('[data-cy="editar-tarifa-button"]').should('be.visible').click();
    }

    static editTarifaTitle(edit_title: string){
        return cy.get('[data-cy="tarifa-nombre"]').type(edit_title);
    }

    static clickGuardarEditButton(){
        return cy.get('[data-cy="guardar-tarifa-button"]').should('be.visible').click();
    }

    static llenarFormularioTarifa(nombre: string, precio: number, id: string, descripcion: string, inicio: string, fin: string){
        cy.get('[data-cy="tarifa-nombre"]').type(nombre);
        cy.get('[data-cy="tarifa-valor-base"]').type(precio.toString());
        cy.get('[data-cy="tarifa-identificador"]').type(id);
        cy.get('[data-cy="tarifa-descripcion"]').type(descripcion);
        cy.get('[data-cy="tarifa-vigencia-inicio"]').type(inicio);
        cy.get('[data-cy="tarifa-vigencia-fin"]').type(fin);
    }

    static clickAgregarDescuento(){
        return cy.get('[data-cy="agregar-descuento-button"]').should('be.visible').click();
    }

    static llenarFormularioDescuento(nombre: string, porcentaje: number, inicio: string, fin: string){
        cy.get('[data-cy="descuento-nombre"]').type(nombre);
        cy.get('[data-cy="descuento-porcentaje"]').type(porcentaje.toString());
        cy.get('[data-cy="descuento-vigencia-inicio"]').type(inicio);
        cy.get('[data-cy="descuento-vigencia-fin"]').type(fin);
    }
}