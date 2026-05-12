export class CreateFormTraveler {
    static validateCreateFormTraveler(form_title: string) {
        return cy.get('[data-cy="create-form-traveler"]').should('include.text', form_title)
    }

    static travelerFormButton() {
        return cy.get('[data-cy="traveler-form-button"]').should('be.visible').click({ force: true });
    }

    static fillNumId(num_id: string) {
        return cy.get('[data-cy="traveler-document"]').type(num_id);
    }

    static fillFirstName(first_name: string) {
        return cy.get('[data-cy="traveler-first-name"]').type(first_name);
    }

    static fillLastName(last_name: string) {
        return cy.get('[data-cy="traveler-last-name"]').type(last_name);
    }

    static fillEmail(email: string) {
        return cy.get('[data-cy="traveler-email"]').type(email);
    }

    static fillPhone(phone: string) {
        return cy.get('[data-cy="traveler-phone"]').type(phone);
    }

    static fillPassword(password: string) {
        return cy.get('[data-cy="traveler-password"]').type(password);
    }
    static fillAddressLine1(line1: string) {
        return cy.get('[data-cy="address-line1"]').type(line1);
    }

    static fillAddressLine2(line2: string) {
        return cy.get('[data-cy="address-line2"]').type(line2);
    }

    static fillCity(city: string) {
        return cy.get('[data-cy="address-city"]').type(city);
    }

    static fillState(state: string) {
        return cy.get('[data-cy="address-state"]').type(state);
    }

    static fillPostalCode(postal_code: string) {
        return cy.get('[data-cy="address-postal"]').type(postal_code);
    }

    static clickCrearCuenta() {
        return cy.get('[data-cy="create-account-button"]', { timeout: 10000 }).should('be.visible').and('not.be.disabled').click({ force: true });
    }

    static duplicateAccountMessage(message: string) {
        return cy.get('[data-cy="submit-error"]').should('include.text', message);
    }
}