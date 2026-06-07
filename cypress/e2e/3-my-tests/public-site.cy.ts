describe('Sitio publico', () => {
    beforeEach(() => {
        cy.viewport(1366, 768);
    });

    it('visita Inicio, Camisetas y Discos desde la navegacion principal', () => {
        cy.visit('/');

        cy.location('pathname').should('eq', '/');
        cy.contains('h1', 'Blackened Camisetas').should('be.visible');
        cy.contains('h2', 'Productos Destacados').should('be.visible');
        cy.wait(800);

        cy.contains('nav a', 'Camisetas').click();
        cy.location('pathname').should('eq', '/camisetas');
        cy.contains('h1', 'Nuestras Camisetas').should('be.visible');
        cy.contains('p', 'catalogo de camisetas').should('be.visible');
        cy.wait(800);

        cy.contains('nav a', 'Discos').click();
        cy.location('pathname').should('eq', '/discos');
        cy.contains('h1', 'Nuestros Discos').should('be.visible');
        cy.contains('p', 'seleccion de discos').should('be.visible');
        cy.wait(800);

        cy.contains('nav a', 'Inicio').click();
        cy.location('pathname').should('eq', '/');
        cy.contains('h2', 'Nuestra Identidad').should('be.visible');
        cy.wait(800);
    });
});
