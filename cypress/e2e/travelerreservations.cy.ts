import { TravelerPage } from '../pages/travelerpage';
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

    it('E0001 - Reservas de usuario tipo traveler', function () {
        //Click en el boton de login
        LogIn.clickLoginButton();

        //Llenamos correo
        LogIn.fillEmail('daniel@hotmail.com');

        //Llenamos contraseña
        LogIn.fillPassword('12345678');

        //Click en el boton de submit
        LogIn.submitLogin();

        //Verificamos que el mensaje de exito se muestre
        let message = 'Has iniciado sesion correctamente.';
        Toastr.getToastrMessage(message);

        //Click en el boton de mis reservas
        NavBar.clickReservas();

        //Validamos que vemos las reservas del manager
        TravelerPage.getReservasTraveler();
    });

    it('E0002 - Reservas de usuario tipo traveler y cierra sesión', function () {
        //Click en el boton de login
        LogIn.clickLoginButton();

        //Llenamos correo
        LogIn.fillEmail('daniel@hotmail.com');

        //Llenamos contraseña
        LogIn.fillPassword('12345678');

        //Click en el boton de submit
        LogIn.submitLogin();

        //Verificamos que el mensaje de exito se muestre
        let message_login = 'Has iniciado sesion correctamente.';
        Toastr.getToastrMessage(message_login);

        //Click en el boton de mis reservas
        NavBar.clickReservas();

        //Validamos que vemos las reservas del manager
        TravelerPage.getReservasTraveler();

        //Click en el boton de cerrar sesión
        LogIn.clickCerrarSesionButton();
    });

    it('E0003 - Reservas de usuario tipo traveler y ver modal de cancelación', function () {
        //Click en el boton de login
        LogIn.clickLoginButton();

        //Llenamos correo
        LogIn.fillEmail('daniel@hotmail.com');

        //Llenamos contraseña
        LogIn.fillPassword('12345678');

        //Click en el boton de submit
        LogIn.submitLogin();

        //Verificamos que el mensaje de exito se muestre
        let message_login = 'Has iniciado sesion correctamente.';
        Toastr.getToastrMessage(message_login);

        //Click en el boton de mis reservas
        NavBar.clickReservas();

        //Validamos que vemos las reservas del manager
        TravelerPage.getReservasTraveler();

        //Damos click en la primera reserva
        TravelerPage.clickReserva();

        //Validamos que se muestre el modal de cancelación
        TravelerPage.getModalInfo();
    });

    it('E0004 - Reservas de usuario tipo traveler, ver modal de cancelación y cancelar reserva', function () {
        //Click en el boton de login
        LogIn.clickLoginButton();

        //Llenamos correo
        LogIn.fillEmail('daniel@hotmail.com');

        //Llenamos contraseña
        LogIn.fillPassword('12345678');

        //Click en el boton de submit
        LogIn.submitLogin();

        //Verificamos que el mensaje de exito se muestre
        let message_login = 'Has iniciado sesion correctamente.';
        Toastr.getToastrMessage(message_login);

        //Click en el boton de mis reservas
        NavBar.clickReservas();

        //Validamos que vemos las reservas del manager
        TravelerPage.getReservasTraveler();

        //Damos click en la primera reserva
        TravelerPage.clickReserva();

        //Validamos que se muestre el modal de cancelación
        TravelerPage.getModalInfo();

        //Click en el boton de cancelar reserva
        TravelerPage.clickCancelarReserva();

        //Validamos que se muestre modal de cancelacion
        let message_cancel = 'Cancelar Reserva';
        TravelerPage.getCancelTitle(message_cancel);
    });

    it('E0005 - Reservas de usuario tipo traveler, ver modal de cancelación, cancelar reserva y volver', function () {
        //Click en el boton de login
        LogIn.clickLoginButton();

        //Llenamos correo
        LogIn.fillEmail('daniel@hotmail.com');

        //Llenamos contraseña
        LogIn.fillPassword('12345678');

        //Click en el boton de submit
        LogIn.submitLogin();

        //Verificamos que el mensaje de exito se muestre
        let message_login = 'Has iniciado sesion correctamente.';
        Toastr.getToastrMessage(message_login);

        //Click en el boton de mis reservas
        NavBar.clickReservas();

        //Validamos que vemos las reservas del manager
        TravelerPage.getReservasTraveler();

        //Damos click en la primera reserva
        TravelerPage.clickReserva();

        //Validamos que se muestre el modal de cancelación
        TravelerPage.getModalInfo();

        //Click en el boton de cancelar reserva
        TravelerPage.clickCancelarReserva();

        cy.wait(2000);

        //Validamos que se muestre modal de cancelacion
        let message_cancel = 'Cancelar Reserva';
        TravelerPage.getCancelTitle(message_cancel);

        //Click en el boton de volver
        TravelerPage.clickVolverModal();

        //Validamos que estamos en el panel
        TravelerPage.getModalInfo();
    });

    it('E0006 - Reservas de usuario tipo traveler, ver modal de cancelación, cancelar reserva, volver y ver reservas activas', function () {
        //Click en el boton de login
        LogIn.clickLoginButton();

        //Llenamos correo
        LogIn.fillEmail('daniel@hotmail.com');

        //Llenamos contraseña
        LogIn.fillPassword('12345678');

        //Click en el boton de submit
        LogIn.submitLogin();

        //Verificamos que el mensaje de exito se muestre
        let message_login = 'Has iniciado sesion correctamente.';
        Toastr.getToastrMessage(message_login);

        //Click en el boton de mis reservas
        NavBar.clickReservas();

        //Validamos que vemos las reservas del manager
        TravelerPage.getReservasTraveler();

        //Damos click en la primera reserva
        TravelerPage.clickReserva();

        //Validamos que se muestre el modal de cancelación
        TravelerPage.getModalInfo();

        //Click en el boton de cancelar reserva
        TravelerPage.clickCancelarReserva();

        cy.wait(2000);

        //Validamos que se muestre modal de cancelacion
        let message_cancel = 'Cancelar Reserva';
        TravelerPage.getCancelTitle(message_cancel);

        //Click en el boton de volver modal
        TravelerPage.clickVolverModal();

        //Validamos que estamos en el panel
        TravelerPage.getModalInfo();

        //Click en el boton de volver del panel
        TravelerPage.clickVolverPanel();

        //Validamos que vemos las reservas del manager
        TravelerPage.getReservasTraveler();
    });
});