export class NavBar {
    static selectCountry(country: string){
        return cy.get('[data-cy="country-select"]').select(country);
    }
}