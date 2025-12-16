describe('Rate Limiter UI', () => {
  const login = (username: string, password: string) => {
    cy.visit('/');
    cy.get('input[formcontrolname="username"]').clear().type(username);
    cy.get('input[formcontrolname="password"]').clear().type(password);
    cy.contains('button', /sign in/i).click();
  };

  const logoutByStorage = () => {
    cy.window().then((w) => w.localStorage.clear());
  };

  it('Admin creates policy for existing client user; client hits notify and gets rate limited', () => {
    // Admin login
    login('admin', 'admin123');

    // Policies page should show
    cy.contains(/client policies/i).should('be.visible');

    // Create/update policy for seeded user "client"
    cy.get('input[formcontrolname="clientId"]').clear().type('client');
    cy.get('input[formcontrolname="windowSeconds"]').clear().type('2');
    cy.get('input[formcontrolname="windowMaxRequests"]').clear().type('1');
    cy.get('input[formcontrolname="monthlyMaxRequests"]').clear().type('100');
    cy.get('select[formcontrolname="throttleMode"]').select('HARD');

    cy.contains('button', /^save$/i).click();

    // Row exists
    cy.contains('.mono', 'client').should('be.visible');

    // Switch to client
    logoutByStorage();

    login('client', 'client123');

    cy.contains(/simulator/i).should('be.visible');

    // 1st request -> allowed
    cy.contains('button', /^request$/i).click();
    cy.contains(/allowed/i).should('be.visible');

    // 2nd request -> blocked
    cy.contains('button', /^request$/i).click();
    cy.contains(/blocked/i).should('be.visible');

    // Wait for window reset then allowed again
    cy.wait(2200);
    cy.contains('button', /^request$/i).click();
    cy.contains(/allowed/i).should('be.visible');
  });
});
