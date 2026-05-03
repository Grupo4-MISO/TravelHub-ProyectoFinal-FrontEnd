import { PropertyDetail } from '../pages/propertydetail';
import { PaymentPage } from '../pages/payment';
import { SearchBar } from '../pages/searchbar';
import { NavBar } from '../pages/navbar';
import { Toastr } from '../pages/toastr';
import { Helper } from '../utils/helper';
import { LogIn } from '../pages/login';

describe('Escenarios E2E para el PropertyDetail', function () {
    //Reglas para antes de cada test
    beforeEach(() => {
        //Visitamos el principal page
        let url = Helper.getUrl();
        cy.visit(url);

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
    });

    it('E0001 - Ir al pago de una propiedad colombiana', function () {       
        //Seleccionamos el pais
        NavBar.selectCountry('🇨🇴 CO');

        //Seleccionamos destino
        SearchBar.selectDestination('Bogota');

        //Seleccionamos fecha de check-in
        SearchBar.selectCheckInDate('2026-11-01');
        
        //Seleccionamos fecha de check-out
        SearchBar.selectCheckOutDate('2026-11-04');

        //Selecionamos cantidad de huespedes
        SearchBar.selectHuespedes(2);

        //Hacemos click en el boton de busqueda
        SearchBar.clickSearchButton();

        //Verificamos que el toastr de éxito aparezca
        Toastr.getToastrMessage('Hospedajes encontrados');

        //Damos click en el primer resultado para ir al detalle de la propiedad
        PropertyDetail.selectPropertyDetail();

        //Validamos nombre del hospedaje
        PropertyDetail.getPropertyName('Hotel B.O.G');

        //Damos click en el boton de reservar
        PropertyDetail.reservarHabitacion();

        //Verificamos que el resumen de la reserva aparezca
        PaymentPage.viewReservationDetails();

        //Verificamos que la tarifa de la reserva aparezca
        PaymentPage.viewPaymentSummary();

        //Seleccionamos el metodo de pago
        PaymentPage.selectPaymentMethod('Stripe');

        //Damos click en confirmacion de reserva para ir a pagos
        PaymentPage.confirmarReserva();
    });

    it('E0002 - Ir al pago de una propiedad argentina', function () {
        //Seleccionamos el pais
        NavBar.selectCountry('🇦🇷 AR');

        //Seleccionamos destino
        SearchBar.selectDestination('Buenos Aires');

        //Seleccionamos fecha de check-in
        SearchBar.selectCheckInDate('2026-11-01');
        
        //Seleccionamos fecha de check-out
        SearchBar.selectCheckOutDate('2026-11-04');

        //Selecionamos cantidad de huespedes
        SearchBar.selectHuespedes(2);

        //Hacemos click en el boton de busqueda
        SearchBar.clickSearchButton();

        //Verificamos que el toastr de éxito aparezca
        Toastr.getToastrMessage('Hospedajes encontrados');

        //Damos click en el primer resultado para ir al detalle de la propiedad
        PropertyDetail.selectPropertyDetail();

        //Validamos nombre del hospedaje
        PropertyDetail.getPropertyName('Buenos Aires Grand Hotel');

        //Damos click en el boton de reservar
        PropertyDetail.reservarHabitacion();

        //Verificamos que el resumen de la reserva aparezca
        PaymentPage.viewReservationDetails();

        //Verificamos que la tarifa de la reserva aparezca
        PaymentPage.viewPaymentSummary();

        //Seleccionamos el metodo de pago
        PaymentPage.selectPaymentMethod('PayPal');

        //Damos click en confirmacion de reserva para ir a pagos
        PaymentPage.confirmarReserva();
    });

    it('E0003 - Ir al pago de una propiedad chilena', function () {
        //Seleccionamos el pais
        NavBar.selectCountry('🇨🇱 CL');

        //Seleccionamos destino
        SearchBar.selectDestination('Santiago');

        //Seleccionamos fecha de check-in
        SearchBar.selectCheckInDate('2026-11-01');
        
        //Seleccionamos fecha de check-out
        SearchBar.selectCheckOutDate('2026-11-04');

        //Selecionamos cantidad de huespedes
        SearchBar.selectHuespedes(2);

        //Hacemos click en el boton de busqueda
        SearchBar.clickSearchButton();

        //Verificamos que el toastr de éxito aparezca
        Toastr.getToastrMessage('Hospedajes encontrados');

        //Damos click en el primer resultado para ir al detalle de la propiedad
        PropertyDetail.selectPropertyDetail();

        //Validamos nombre del hospedaje
        PropertyDetail.getPropertyName('Santiago Plaza Suites');

        //Damos click en el boton de reservar
        PropertyDetail.reservarHabitacion();

        //Verificamos que el resumen de la reserva aparezca
        PaymentPage.viewReservationDetails();

        //Verificamos que la tarifa de la reserva aparezca
        PaymentPage.viewPaymentSummary();

        //Seleccionamos el metodo de pago
        PaymentPage.selectPaymentMethod('MercadoPago');

        //Damos click en confirmacion de reserva para ir a pagos
        PaymentPage.confirmarReserva();
    });

    it('E0004 - Ir al pago de una propiedad ecuatoriana', function () {
        //Seleccionamos el pais
        NavBar.selectCountry('🇪🇨 EC');

        //Seleccionamos destino
        SearchBar.selectDestination('Quito');

        //Seleccionamos fecha de check-in
        SearchBar.selectCheckInDate('2026-11-01');
        
        //Seleccionamos fecha de check-out
        SearchBar.selectCheckOutDate('2026-11-04');

        //Selecionamos cantidad de huespedes
        SearchBar.selectHuespedes(2);

        //Hacemos click en el boton de busqueda
        SearchBar.clickSearchButton();

        //Verificamos que el toastr de éxito aparezca
        Toastr.getToastrMessage('Hospedajes encontrados');

        //Damos click en el primer resultado para ir al detalle de la propiedad
        PropertyDetail.selectPropertyDetail();

        //Validamos nombre del hospedaje
        PropertyDetail.getPropertyName('Quito Business & Stay');

        //Damos click en el boton de reservar
        PropertyDetail.reservarHabitacion();

        //Verificamos que el resumen de la reserva aparezca
        PaymentPage.viewReservationDetails();

        //Verificamos que la tarifa de la reserva aparezca
        PaymentPage.viewPaymentSummary();

        //Seleccionamos el metodo de pago
        PaymentPage.selectPaymentMethod('Stripe');

        //Damos click en confirmacion de reserva para ir a pagos
        PaymentPage.confirmarReserva();
    });

    it('E0005 - Ir al pago de una propiedad mexicana', function () {
        //Seleccionamos el pais
        NavBar.selectCountry('🇲🇽 MX');

        //Seleccionamos destino
        SearchBar.selectDestination('Tulum');

        //Seleccionamos fecha de check-in
        SearchBar.selectCheckInDate('2026-11-01');
        
        //Seleccionamos fecha de check-out
        SearchBar.selectCheckOutDate('2026-11-04');

        //Selecionamos cantidad de huespedes
        SearchBar.selectHuespedes(2);

        //Hacemos click en el boton de busqueda
        SearchBar.clickSearchButton();

        //Verificamos que el toastr de éxito aparezca
        Toastr.getToastrMessage('Hospedajes encontrados');

        //Damos click en el primer resultado para ir al detalle de la propiedad
        PropertyDetail.selectPropertyDetail();

        //Validamos nombre del hospedaje
        PropertyDetail.getPropertyName('Tulum Plaza Suites');

        //Damos click en el boton de reservar
        PropertyDetail.reservarHabitacion();

        //Verificamos que el resumen de la reserva aparezca
        PaymentPage.viewReservationDetails();

        //Verificamos que la tarifa de la reserva aparezca
        PaymentPage.viewPaymentSummary();

        //Seleccionamos el metodo de pago
        PaymentPage.selectPaymentMethod('PayPal');

        //Damos click en confirmacion de reserva para ir a pagos
        PaymentPage.confirmarReserva();
    });

    it('E0006 - Ir al pago de una propiedad peruana', function () {
        //Seleccionamos el pais
        NavBar.selectCountry('🇵🇪 PE');

        //Seleccionamos destino
        SearchBar.selectDestination('Cusco');

        //Seleccionamos fecha de check-in
        SearchBar.selectCheckInDate('2026-11-01');
        
        //Seleccionamos fecha de check-out
        SearchBar.selectCheckOutDate('2026-11-04');

        //Selecionamos cantidad de huespedes
        SearchBar.selectHuespedes(2);

        //Hacemos click en el boton de busqueda
        SearchBar.clickSearchButton();

        //Verificamos que el toastr de éxito aparezca
        Toastr.getToastrMessage('Hospedajes encontrados');

        //Damos click en el primer resultado para ir al detalle de la propiedad
        PropertyDetail.selectPropertyDetail();

        //Validamos nombre del hospedaje
        PropertyDetail.getPropertyName('Hotel Boutique Cusco');

        //Damos click en el boton de reservar
        PropertyDetail.reservarHabitacion();

        //Verificamos que el resumen de la reserva aparezca
        PaymentPage.viewReservationDetails();

        //Verificamos que la tarifa de la reserva aparezca
        PaymentPage.viewPaymentSummary();

        //Seleccionamos el metodo de pago
        PaymentPage.selectPaymentMethod('MercadoPago');

        //Damos click en confirmacion de reserva para ir a pagos
        PaymentPage.confirmarReserva();
    });
});