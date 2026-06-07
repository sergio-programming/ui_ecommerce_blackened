const getRequiredCypressEnv = (key: string): string => {
    const value = Cypress.env(key);

    expect(
        value,
        `Configura ${key} en cypress.env.json o ejecuta Cypress con --env ${key}=valor`
    ).to.be.a('string').and.not.be.empty;

    return value;
};

describe('Login y navegacion de usuario cliente', () => {
    beforeEach(() => {
        cy.viewport(1366, 768);
        cy.clearLocalStorage();
        cy.clearCookies();
    });

    it('inicia sesion como user y navega por informacion, direcciones e historial de ordenes', () => {
        const userEmail = getRequiredCypressEnv('userEmail');
        const userPassword = getRequiredCypressEnv('userPassword');

        cy.visit('/auth/login');

        cy.contains('h2', 'Inicia').should('be.visible');
        cy.wait(600);

        cy.get('#login-email').type(userEmail);
        cy.wait(400);

        cy.get('#login-password').type(userPassword, { log: false });
        cy.wait(600);

        cy.intercept('POST', '**/auth/login').as('loginRequest');
        cy.contains('button[type="submit"]', 'Ingresar').click();

        cy.wait('@loginRequest')
            .its('response.statusCode')
            .should('be.oneOf', [200, 201]);

        cy.location('pathname', { timeout: 10000 }).should('eq', '/user/mi-cuenta');
        cy.contains('h1', 'Mi Cuenta').should('be.visible');
        cy.contains('h2', 'Informacion de la cuenta').should('be.visible');
        cy.contains('Correo electronico').should('be.visible');
        cy.wait(800);

        cy.contains('a', 'Direcciones registradas').click();
        cy.location('pathname').should('eq', '/user/mi-cuenta/direcciones');
        cy.contains('h1', 'Direcciones').should('be.visible');
        cy.contains('Consulta las direcciones').should('be.visible');
        cy.wait(800);

        cy.contains('a', 'Historial de ordenes').click();
        cy.location('pathname').should('eq', '/user/mi-cuenta/historial-ordenes');
        cy.contains('h1', 'Historial de ordenes').should('be.visible');
        cy.contains('Consulta tus compras').should('be.visible');
        cy.wait(800);

        cy.contains('a', 'Informacion de la cuenta').click();
        cy.location('pathname').should('eq', '/user/mi-cuenta');
        cy.contains('h2', 'Informacion de la cuenta').should('be.visible');
        cy.wait(800);
    });
});
