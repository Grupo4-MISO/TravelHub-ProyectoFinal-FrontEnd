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

    it('E0001 - Login de usuario tipo traveler', function () {
        //Click en el boton de login
        LogIn.clickLoginButton();

        //Llenamos correo
        LogIn.fillEmail('usuario_prueba@gmail.com');

        //Llenamos contraseña
        LogIn.fillPassword('usuario');

        //Click en el boton de submit
        LogIn.submitLogin();

        //Verificamos que el mensaje de exito se muestre
        let message = 'Has iniciado sesion correctamente.';
        Toastr.getToastrMessage(message);
    });

    it('E0002 - Login de usuario tipo traveler y cierra sesión', function () {
        //Click en el boton de login
        LogIn.clickLoginButton();

        //Llenamos correo
        LogIn.fillEmail('usuario_prueba@gmail.com');

        //Llenamos contraseña
        LogIn.fillPassword('usuario');

        //Click en el boton de submit
        LogIn.submitLogin();

        //Verificamos que el mensaje de exito se muestre
        let message_login = 'Has iniciado sesion correctamente.';
        Toastr.getToastrMessage(message_login);

        //Click en el boton de cerrar sesión
        LogIn.clickCerrarSesionButton();

        //Verificamos que el mensaje de exito se muestre
        let message_logout = 'Sesión cerrada correctamente.';
        Toastr.getToastrMessage(message_logout);
    });

    it('E0003 - Login de usuario tipo manager', function () {
        //Click en el boton de login
        LogIn.clickLoginButton();

        //Llenamos correo
        LogIn.fillEmail('alojamiento_prueba@gmail.com');

        //Llenamos contraseña
        LogIn.fillPassword('alojamiento');

        //Click en el boton de submit
        LogIn.submitLogin();

        //Verificamos que el mensaje de exito se muestre
        let message = 'Has iniciado sesion correctamente.';
        Toastr.getToastrMessage(message);
    });

    it('E0004 - Login de usuario tipo manager y cierra sesión', function () {
        //Click en el boton de login
        LogIn.clickLoginButton();

        //Llenamos correo
        LogIn.fillEmail('alojamiento_prueba@gmail.com');

        //Llenamos contraseña
        LogIn.fillPassword('alojamiento');

        //Click en el boton de submit
        LogIn.submitLogin();

        //Verificamos que el mensaje de exito se muestre
        let message_login = 'Has iniciado sesion correctamente.';
        Toastr.getToastrMessage(message_login);

        //Click en el boton de cerrar sesión
        LogIn.clickCerrarSesionButton();

        //Verificamos que el mensaje de exito se muestre
        let message_logout = 'Sesión cerrada correctamente.';
        Toastr.getToastrMessage(message_logout);
    });
    
});