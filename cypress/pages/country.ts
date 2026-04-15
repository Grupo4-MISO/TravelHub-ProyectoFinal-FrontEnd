export class Country {
    static selectCountry(country: string){
        return cy.get('[data-cy="country-select"]').select(country);
    }
}