import { HotelPage } from '../pages/hotelpage';
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

    it('E0001 - Abrir modal de buscar reservas', function () {
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

        //Click en el boton de mis reservas
        NavBar.clickReservas();

        // Validamos que vemos las reservas del manager
        HotelPage.getReservasManager();

        //Click en el boton de buscar reservas
        HotelPage.clickBuscarReservas();
    });

    it('E0002 - Abrir modal de buscar reservas y volver', function () {
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

        //Click en el boton de mis reservas
        NavBar.clickReservas();

        // Validamos que vemos las reservas del manager
        HotelPage.getReservasManager();

        //Click en el boton de buscar reservas
        HotelPage.clickBuscarReservas();

        //Click en el boton de cerrar modal
        HotelPage.closeBuscarReservasModal();
    });

    it('E0003 - Abrir modal de buscar reservas y ver mensaje de coincidencia exitoso', function () {
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

        //Click en el boton de mis reservas
        NavBar.clickReservas();

        // Validamos que vemos las reservas del manager
        HotelPage.getReservasManager();

        //Click en el boton de buscar reservas
        HotelPage.clickBuscarReservas();

        //Buscamos una reserva por codigo
        let codigo_reserva = 'RSV-973853AA';
        HotelPage.buscarReservaPorCodigo(codigo_reserva);

        //Hacemos click en campo de habitaciones
        HotelPage.clickCampoHabitaciones();

        //Validamos que el resultado de los filtros se muestre
        let filter_result = '1 reservas coinciden con los criterios de búsqueda.';
        HotelPage.getResultadosFiltros(filter_result);
    });

    it('E0004 - Abrir modal de buscar reservas y ver mensaje de coincidencia fallido', function () {
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

        //Click en el boton de mis reservas
        NavBar.clickReservas();

        // Validamos que vemos las reservas del manager
        HotelPage.getReservasManager();

        //Click en el boton de buscar reservas
        HotelPage.clickBuscarReservas();

        //Buscamos una reserva por codigo
        let codigo_reserva = 'ñmdlmlksdmfklsdf';
        HotelPage.buscarReservaPorCodigo(codigo_reserva);

        //Hacemos click en campo de habitaciones
        HotelPage.clickCampoHabitaciones();

        //Validamos que el resultado de los filtros se muestre
        let filter_result = '0 reservas coinciden con los criterios de búsqueda.';
        HotelPage.getResultadosFiltros(filter_result);
    });

    it('E0005 - Abrir modal de buscar reservas y aplicar filtros', function () {
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

        //Click en el boton de mis reservas
        NavBar.clickReservas();

        // Validamos que vemos las reservas del manager
        HotelPage.getReservasManager();

        //Click en el boton de buscar reservas
        HotelPage.clickBuscarReservas();

        //Buscamos una reserva por codigo
        let codigo_reserva = 'RSV-973853AA';
        HotelPage.buscarReservaPorCodigo(codigo_reserva);

        //Hacemos click en campo de habitaciones
        HotelPage.clickCampoHabitaciones();

        //Validamos que el resultado de los filtros se muestre
        let filter_result = '1 reservas coinciden con los criterios de búsqueda.';
        HotelPage.getResultadosFiltros(filter_result);

        //Aplicamos los filtros
        HotelPage.aplicarFiltros();

        //Validamos que el resultado de los filtros se muestre
        let filter_message_result = 'Reservas encontradas para: Código "RSV-973853AA"';
        HotelPage.getReservasManager(filter_message_result);
    });

    it('E0006 - Abrir modal de buscar reservas, aplicar filtros y remover filtros', function () {
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

        //Click en el boton de mis reservas
        NavBar.clickReservas();

        // Validamos que vemos las reservas del manager
        HotelPage.getReservasManager();

        //Click en el boton de buscar reservas
        HotelPage.clickBuscarReservas();

        //Buscamos una reserva por codigo
        let codigo_reserva = 'RSV-973853AA';
        HotelPage.buscarReservaPorCodigo(codigo_reserva);

        //Hacemos click en campo de habitaciones
        HotelPage.clickCampoHabitaciones();

        //Validamos que el resultado de los filtros se muestre
        let filter_result = '1 reservas coinciden con los criterios de búsqueda.';
        HotelPage.getResultadosFiltros(filter_result);

        //Aplicamos los filtros
        HotelPage.aplicarFiltros();

        //Validamos que el resultado de los filtros se muestre
        let filter_message_result = 'Reservas encontradas para: Código "RSV-973853AA"';
        HotelPage.getReservasManager(filter_message_result);

        //Click en el boton de remover filtros
        HotelPage.clickRemoverFiltros();

        //Validamos que la tabla de reservas vuelva a mostrar todas las reservas
        HotelPage.getReservasManager();
    });
});