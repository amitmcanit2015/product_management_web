describe('Login Page', () => {
    it('should validate required fields', () => {
        cy.visit('/login');
        cy.get('button[type="submit"]').should('be.disabled');
        cy.get('input[formcontrolname="email"]').focus().blur();
        cy.get('input[formcontrolname="password"]').focus().blur();
        cy.get('#emailError').should('contain', 'Email is required');
        cy.get('#passwordError').should('contain', 'Password is required');
    });

    it('should validate email format', () => {
        cy.visit('/login');
        cy.get('input[formcontrolname="email"]').type('invalid');
        cy.get('input[formcontrolname="email"]').blur();
        cy.get('#emailError').should('contain', 'Invalid email format');
    });

    it('should validate password length', () => {
        cy.visit('/login'); 
        cy.get('input[formcontrolname="password"]').type('123');
        cy.get('input[formcontrolname="password"]').blur();
        cy.get('#passwordError').should('contain', 'Password must be at least 6 characters.');
    });

    it('should show error for invalid credentials', () => {
        cy.visit('/login');
        cy.get('input[formcontrolname="email"]').type('test@email.com');
        cy.get('input[formcontrolname="password"]').type('wrongpassword');
        cy.get('button[type="submit"]').click({ force: true });
        // cy.get('#loginError').should('contain', 'Invalid credentials');
    });
});