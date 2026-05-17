import { TarifasPage } from '../pages/tarifas';
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

    it('E0001 - Ver página de tarifas', function () {
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

        //Click en el boton de tarifas
        NavBar.clickTarifas();

        //Validamos que estamos en la pagina de tarifas
        TarifasPage.getPageTitle();
    });

    it('E0002 - Ver página de tarifas y volver al home', function () {
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

        //Click en el boton de tarifas
        NavBar.clickTarifas();

        //Validamos que estamos en la pagina de tarifas
        TarifasPage.getPageTitle();

        //Click en el boton de volver
        TarifasPage.clickBackButton();
    });

    it('E0003 - Ir a crear una nueva tarifa', function () {
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

        //Click en el boton de tarifas
        NavBar.clickTarifas();

        //Validamos que estamos en la pagina de tarifas
        TarifasPage.getPageTitle();

        //Click en el boton de nueva tarifa
        TarifasPage.clickNewTarifa();

        //Validamos que estamos en la pagina de nueva tarifa
        TarifasPage.getNewTarifaTitle();
    });

    it('E0004 - Cancelar creación de tarifa', function () {
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

        //Click en el boton de tarifas
        NavBar.clickTarifas();

        //Validamos que estamos en la pagina de tarifas
        TarifasPage.getPageTitle();

        //Click en el boton de nueva tarifa
        TarifasPage.clickNewTarifa();

        //Validamos que estamos en la pagina de nueva tarifa
        TarifasPage.getNewTarifaTitle();

        //Click en el boton de cancelar
        TarifasPage.clickCancelarButton();

        //Validamos que estamos de vuelta en la pagina de tarifas
        TarifasPage.getPageTitle();
    });

    it('E0005 - Crear nueva tarifa sin descuentos', function () {
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

        //Click en el boton de tarifas
        NavBar.clickTarifas();

        //Validamos que estamos en la pagina de tarifas
        TarifasPage.getPageTitle();

        //Click en el boton de nueva tarifa
        TarifasPage.clickNewTarifa();

        //Validamos que estamos en la pagina de nueva tarifa
        TarifasPage.getNewTarifaTitle();

        //Llenamos el formulario de nueva tarifa
        let nombre = `Tarifa flexible ${Math.floor(Math.random() * 100000)}`;
        let precio = 100 + Math.floor(Math.random() * 100);
        let id = `TAR-FLEX-${Math.floor(Math.random() * 1000)}`;
        let descripcion = 'Tarifa con cancelación gratuita hasta 24 horas antes del check-in.';
        let inicio = '2024-01-01';
        let fin = '2024-12-31';
        TarifasPage.llenarFormularioTarifa(nombre, precio, id, descripcion, inicio, fin);
    });

    it('E0006 - Crear nueva tarifa con descuentos', function () {
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

        //Click en el boton de tarifas
        NavBar.clickTarifas();

        //Validamos que estamos en la pagina de tarifas
        TarifasPage.getPageTitle();

        //Click en el boton de nueva tarifa
        TarifasPage.clickNewTarifa();

        //Validamos que estamos en la pagina de nueva tarifa
        TarifasPage.getNewTarifaTitle();

        //Llenamos el formulario de nueva tarifa
        let nombre = `Tarifa flexible ${Math.floor(Math.random() * 100000)}`;
        let precio = 100 + Math.floor(Math.random() * 100);
        let id = `TAR-FLEX-${Math.floor(Math.random() * 1000)}`;
        let descripcion = 'Tarifa con cancelación gratuita hasta 24 horas antes del check-in.';
        let inicio = '2024-01-01';
        let fin = '2024-12-31';
        TarifasPage.llenarFormularioTarifa(nombre, precio, id, descripcion, inicio, fin);

        //Click agregar descuento
        TarifasPage.clickAgregarDescuento();

        //Llenamos el formulario de descuento
        let descuento_nombre = `Descuento por reserva anticipada ${Math.floor(Math.random() * 100000)}`;
        let descuento_porcentaje = 10 + Math.floor(Math.random() * 20);
        let descuento_inicio = '2024-01-01';
        let descuento_fin = '2024-06-30';
        TarifasPage.llenarFormularioDescuento(descuento_nombre, descuento_porcentaje, descuento_inicio, descuento_fin);
    });

    it('E0007 - Editar tarifa existente', function () {
        //Click en el boton de login
        LogIn.clickLoginButton();

        //Llenamos correo
        LogIn.fillEmail('boutique_santiago@gmail.com');

        //Llenamos contraseña
        LogIn.fillPassword('12345');

        //Click en el boton de submit
        LogIn.submitLogin();

        //Verificamos que el mensaje de exito se muestre
        let message = 'Has iniciado sesion correctamente.';
        Toastr.getToastrMessage(message);

        //Click en el boton de tarifas
        NavBar.clickTarifas();

        //Validamos que estamos en la pagina de tarifas
        TarifasPage.getPageTitle();

        //Click en el boton de editar tarifa
        TarifasPage.clickEditTarifa();

        //Validamos que estamos en la pagina de nueva tarifa
        TarifasPage.getNewTarifaTitle();
    });

    it('E0008 - Cancelar edición de tarifa existente', function () {
        //Click en el boton de login
        LogIn.clickLoginButton();

        //Llenamos correo
        LogIn.fillEmail('boutique_santiago@gmail.com');

        //Llenamos contraseña
        LogIn.fillPassword('12345');

        //Click en el boton de submit
        LogIn.submitLogin();

        //Verificamos que el mensaje de exito se muestre
        let message = 'Has iniciado sesion correctamente.';
        Toastr.getToastrMessage(message);

        //Click en el boton de tarifas
        NavBar.clickTarifas();

        //Validamos que estamos en la pagina de tarifas
        TarifasPage.getPageTitle();

        //Click en el boton de editar tarifa
        TarifasPage.clickEditTarifa();

        //Validamos que estamos en la pagina de nueva tarifa
        TarifasPage.getNewTarifaTitle();

        //Cancelamos la edición
        TarifasPage.clickCancelarButton();

        //Validamos que estamos de vuelta en la pagina de tarifas
        TarifasPage.getPageTitle();
    });

    it('E0009 - Guardar edición de tarifa existente', function () {
        //Click en el boton de login
        LogIn.clickLoginButton();

        //Llenamos correo
        LogIn.fillEmail('boutique_santiago@gmail.com');

        //Llenamos contraseña
        LogIn.fillPassword('12345');

        //Click en el boton de submit
        LogIn.submitLogin();

        //Verificamos que el mensaje de exito se muestre
        let message = 'Has iniciado sesion correctamente.';
        Toastr.getToastrMessage(message);

        //Click en el boton de tarifas
        NavBar.clickTarifas();

        //Validamos que estamos en la pagina de tarifas
        TarifasPage.getPageTitle();

        //Click en el boton de editar tarifa
        TarifasPage.clickEditTarifa();

        //Validamos que estamos en la pagina de nueva tarifa
        TarifasPage.getNewTarifaTitle();

        //Editamos el nombre de la tarifa
        const random = Math.floor(Math.random() * 100000);
        let edit_title = `Tarifa editada ${random}`;
        TarifasPage.editTarifaTitle(edit_title);

        //Cancelamos la edición
        TarifasPage.clickGuardarEditButton();

        //Validamos que estamos de vuelta en la pagina de tarifas
        TarifasPage.getPageTitle();
    });
});