describe('Product Manage Page', () => {
    it('should display the product manage form', () => {
      cy.visit('/product-manage');
      cy.contains('Product Manage'); // Adjust if your page title is different
      cy.get('form').should('exist');
      cy.get('input[formcontrolname="name"]').should('exist');
      cy.get('input[formcontrolname="description"]').should('exist');
      cy.get('input[formcontrolname="price"]').should('exist');
      cy.get('input[formcontrolname="category"]').should('exist');
    });
  
    it('should validate required fields', () => {
      cy.visit('/product-manage');
      cy.get('button[type="submit"]').click({ force: true });
      cy.contains('Please fill the form'); // Or check for validation errors on the page
    });
  
    it('should submit the form with valid data', () => {
      cy.visit('/product-manage');
      cy.get('input[formcontrolname="name"]').type('Test Product');
      cy.get('input[formcontrolname="description"]').type('A test product');
      cy.get('input[formcontrolname="price"]').type('100');
      cy.get('input[formcontrolname="category"]').type('Test Category');
      cy.get('button[type="submit"]').click({ force: true });
      // Adjust the next line to your actual success indication
      cy.contains('Successfully submitted').should('exist');
    });
  });