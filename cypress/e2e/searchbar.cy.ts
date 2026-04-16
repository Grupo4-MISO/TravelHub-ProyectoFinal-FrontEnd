import { SearchBar } from '../pages/searchbar';
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

    it('E0001 - Buscar destinos colombianos', function () {
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
    });

    it('E0002 - Buscar destinos argentinos', function () {
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
    });

    it('E0003 - Buscar destinos chilenos', function () {
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
    });

    it('E0004 - Buscar destinos ecuatorianos', function () {
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
    });

    it('E0005 - Buscar destinos mexicanos', function () {
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
    });

    it('E0006 - Buscar destinos peruanos', function () {
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
    });
});