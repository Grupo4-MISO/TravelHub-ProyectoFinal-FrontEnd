import { PropertyDetail } from '../pages/propertydetail';
import { SearchBar } from '../pages/searchbar';
import { Country } from '../pages/country';
import { Toastr } from '../pages/toastr';
import { Helper } from '../utils/helper';

describe('Escenarios E2E para el PropertyDetail', function () {
    //Reglas para antes de cada test
    beforeEach(() => {
        //Visitamos el principal page
        let url = Helper.getUrl();
        cy.visit(url);
    });

    it('E0001 - Detalle de una propiedad colombiana', function () {
        //Seleccionamos el pais
        Country.selectCountry('🇨🇴 CO');

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
        Toastr.getToastrMessage();

        //Damos click en el primer resultado para ir al detalle de la propiedad
        PropertyDetail.selectPropertyDetail();

        //Validamos nombre del hospedaje
        PropertyDetail.getPropertyName('Hotel Casa Medina');
    });

    it('E0002 - Detalle de una propiedad argentina', function () {
        //Seleccionamos el pais
        Country.selectCountry('🇦🇷 AR');

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
        Toastr.getToastrMessage();

        //Damos click en el primer resultado para ir al detalle de la propiedad
        PropertyDetail.selectPropertyDetail();

        //Validamos nombre del hospedaje
        PropertyDetail.getPropertyName('Buenos Aires Grand Hotel');
    });

    it('E0003 - Detalle de una propiedad chilena', function () {
        //Seleccionamos el pais
        Country.selectCountry('🇨🇱 CL');

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
        Toastr.getToastrMessage();

        //Damos click en el primer resultado para ir al detalle de la propiedad
        PropertyDetail.selectPropertyDetail();

        //Validamos nombre del hospedaje
        PropertyDetail.getPropertyName('Santiago Grand Hotel');
    });

    it('E0004 - Detalle de una propiedad ecuatoriana', function () {
        //Seleccionamos el pais
        Country.selectCountry('🇪🇨 EC');

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
        Toastr.getToastrMessage();

        //Damos click en el primer resultado para ir al detalle de la propiedad
        PropertyDetail.selectPropertyDetail();

        //Validamos nombre del hospedaje
        PropertyDetail.getPropertyName('Quito Grand Hotel');
    });

    it('E0005 - Detalle de una propiedad mexicana', function () {
        //Seleccionamos el pais
        Country.selectCountry('🇲🇽 MX');

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
        Toastr.getToastrMessage();

        //Damos click en el primer resultado para ir al detalle de la propiedad
        PropertyDetail.selectPropertyDetail();

        //Validamos nombre del hospedaje
        PropertyDetail.getPropertyName('Tulum Grand Hotel');
    });

    it('E0006 - Detalle de una propiedad peruana', function () {
        //Seleccionamos el pais
        Country.selectCountry('🇵🇪 PE');

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
        Toastr.getToastrMessage();

        //Damos click en el primer resultado para ir al detalle de la propiedad
        PropertyDetail.selectPropertyDetail();

        //Validamos nombre del hospedaje
        PropertyDetail.getPropertyName('Cusco Grand Hotel');
    });
});