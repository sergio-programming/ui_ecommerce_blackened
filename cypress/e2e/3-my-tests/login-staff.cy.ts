const getRequiredCypressEnv = (key: string): string => {
    const value = Cypress.env(key);

    expect(
        value,
        `Configura ${key} en cypress.env.json o ejecuta Cypress con --env ${key}=valor`
    ).to.be.a('string').and.not.be.empty;

    return value;
};

describe('Login y navegacion de staff', () => {
    beforeEach(() => {
        cy.viewport(1366, 768);
        cy.clearLocalStorage();
        cy.clearCookies();
    });

    it('inicia sesion como staff y navega por dashboard, productos y ordenes', () => {
        const staffEmail = getRequiredCypressEnv('staffEmail');
        const staffPassword = getRequiredCypressEnv('staffPassword');

        cy.visit('/auth/login');

        cy.contains('h2', 'Inicia').should('be.visible');
        cy.wait(600);

        cy.get('#login-email').type(staffEmail);
        cy.wait(400);

        cy.get('#login-password').type(staffPassword, { log: false });
        cy.wait(600);

        cy.intercept('POST', '**/auth/login').as('loginRequest');
        cy.contains('button[type="submit"]', 'Ingresar').click();

        cy.wait('@loginRequest')
            .its('response.statusCode')
            .should('be.oneOf', [200, 201]);

        cy.location('pathname', { timeout: 10000 }).should('eq', '/staff/dashboard');
        cy.contains('Total Productos Registrados').should('be.visible');
        cy.contains('Total Ordenes Generadas').should('be.visible');
        cy.wait(800);

        cy.contains('nav a', 'Productos').click();
        cy.location('pathname').should('eq', '/staff/productos');
        cy.contains('h1', 'Lista de Productos').should('be.visible');
        cy.contains('button', 'Nuevo Producto').should('be.visible');
        cy.wait(800);

        cy.contains('nav a', 'Ordenes').click();
        cy.location('pathname').should('eq', '/staff/ordenes');
        cy.contains('h1', 'Lista de Ordenes').should('be.visible');
        cy.contains('Consulta los pedidos generados').should('be.visible');
        cy.wait(800);

        cy.contains('nav a', 'Dashboard').click();
        cy.location('pathname').should('eq', '/staff/dashboard');
        cy.contains('Total Productos Registrados').should('be.visible');
        cy.wait(800);
    });
});
