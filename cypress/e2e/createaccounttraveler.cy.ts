import { CreateFormTraveler } from '../pages/createformtraveler';
import { NavBar } from '../pages/navbar';
import { Toastr } from '../pages/toastr';
import { Helper } from '../utils/helper';

describe('Escenarios E2E para el SearchBar', function () {
    //Reglas para antes de cada test
    beforeEach(() => {
        //Visitamos el principal page
        let url = Helper.getUrl();
        cy.visit(url);
    });

    it('E0001 - Crear cuenta traveler', function () {
        //Click en el boton de crear cuenta
        NavBar.clickCrearCuenta();

        //Validamos que entramos a la pagina de crear cuenta
        let form_title = 'Crear Cuenta';
        CreateFormTraveler.validateCreateFormTraveler(form_title);

        //Llenamos el campos personales del cliente
        CreateFormTraveler.fillNumId('502356897');
        CreateFormTraveler.fillFirstName('Juan');
        CreateFormTraveler.fillLastName('Pérez');
        CreateFormTraveler.fillEmail('juan@micorreo.com');
        CreateFormTraveler.fillPhone('3001234567');
        CreateFormTraveler.fillPassword('contraseña123');

        //Llenamos campos de direccion del cliente
        CreateFormTraveler.fillAddressLine1('Calle 123');
        CreateFormTraveler.fillAddressLine2('Apt 456');
        CreateFormTraveler.fillCity('Ciudad de México');
        CreateFormTraveler.fillState('Estado de México');
        CreateFormTraveler.fillPostalCode('111321');

        cy.visit(Helper.getUrl());
    });

    it('E0002 - Crear cuenta traveler duplicada', function () {
        //Click en el boton de crear cuenta
        NavBar.clickCrearCuenta();

        //Validamos que entramos a la pagina de crear cuenta
        let form_title = 'Crear Cuenta';
        CreateFormTraveler.validateCreateFormTraveler(form_title);

        //Llenamos el campos personales del cliente
        CreateFormTraveler.fillNumId('502356897');
        CreateFormTraveler.fillFirstName('Juan');
        CreateFormTraveler.fillLastName('Pérez');
        CreateFormTraveler.fillEmail('juan@micorreo.com');
        CreateFormTraveler.fillPhone('3001234567');
        CreateFormTraveler.fillPassword('contraseña123');

        //Llenamos campos de direccion del cliente
        CreateFormTraveler.fillAddressLine1('Calle 123');
        CreateFormTraveler.fillAddressLine2('Apt 456');
        CreateFormTraveler.fillCity('Ciudad de México');
        CreateFormTraveler.fillState('Estado de México');
        CreateFormTraveler.fillPostalCode('111321');

        cy.visit(Helper.getUrl());
    });
});