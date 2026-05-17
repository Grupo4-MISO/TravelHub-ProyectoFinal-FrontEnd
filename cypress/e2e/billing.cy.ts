import { BillingPage } from '../pages/billing';
import { NavBar } from '../pages/navbar';
import { Toastr } from '../pages/toastr';
import { Helper } from '../utils/helper';
import { LogIn } from '../pages/login';

describe('Escenarios E2E para el LogIn', function () {
    //Reglas para antes de cada test
    beforeEach(() => {
        //Visitamos el principal page
        let url = Helper.getUrl();
        cy.visit(url);
    });

    it('E0001 - Ver página de facturación', function () {
        //Click en el boton de login
        LogIn.clickLoginButton();

        //Llenamos correo
        LogIn.fillEmail('buenos_aires_plaza_suites@gmail.com');

        //Llenamos contraseña
        LogIn.fillPassword('12345');

        //Click en el boton de submit
        LogIn.submitLogin();

        //Verificamos que el mensaje de exito se muestre
        let message = 'Has iniciado sesion correctamente.';
        Toastr.getToastrMessage(message);

        //Click en el boton de facturación
        NavBar.clickFacturacion();

        //Validamos que estamos en la pagina de facturación
        BillingPage.getPageTitle();
    });

    it('E0002 - Ver total generado de facturación', function () {
        //Click en el boton de login
        LogIn.clickLoginButton();

        //Llenamos correo
        LogIn.fillEmail('buenos_aires_plaza_suites@gmail.com');

        //Llenamos contraseña
        LogIn.fillPassword('12345');

        //Click en el boton de submit
        LogIn.submitLogin();

        //Verificamos que el mensaje de exito se muestre
        let message = 'Has iniciado sesion correctamente.';
        Toastr.getToastrMessage(message);

        //Click en el boton de facturación
        NavBar.clickFacturacion();

        //Validamos que estamos en la pagina de facturación
        BillingPage.getPageTitle();

        //Validamos que el total generado se muestre correctamente
        BillingPage.getTotalGenerated();
    });

    it('E0003 - Ver tabla con facturación', function () {
        //Click en el boton de login
        LogIn.clickLoginButton();

        //Llenamos correo
        LogIn.fillEmail('buenos_aires_plaza_suites@gmail.com');

        //Llenamos contraseña
        LogIn.fillPassword('12345');

        //Click en el boton de submit
        LogIn.submitLogin();

        //Verificamos que el mensaje de exito se muestre
        let message = 'Has iniciado sesion correctamente.';
        Toastr.getToastrMessage(message);

        //Click en el boton de facturación
        NavBar.clickFacturacion();

        //Validamos que estamos en la pagina de facturación
        BillingPage.getPageTitle();

        //Validamos que el total generado se muestre correctamente
        BillingPage.getTotalGenerated();

        //Validamos que la tabla de facturación se muestre correctamente
        BillingPage.getBillingTable();
    });
});