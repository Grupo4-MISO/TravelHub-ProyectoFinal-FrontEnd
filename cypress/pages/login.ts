export class LogIn {
    static clickLoginButton() {
        return cy.get('[data-cy="login-button"]').click({ force: true });
    }

    static fillEmail(email: string) {
        return cy.get('[data-cy="email-input"]').type(email);
    }

    static fillPassword(password: string) {
        return cy.get('[data-cy="password-input"]').type(password);
    }

    static submitLogin() {
        return cy.get('[data-cy="login-submit-button"]').click({ force: true });
    }

    static clickCerrarSesionButton() {
        return cy.get('[data-cy="logout-button"]').click({ force: true });
    }
}