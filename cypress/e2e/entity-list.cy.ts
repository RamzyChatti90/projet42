describe('TestEntity E2E Tests', () => {
  const entityPageUrl = '/test-entities'; // Chemin d'accès à la liste des entités (ex: 'test-entities' pour l'entité TestEntity)
  const entityCreateUrl = '/test-entities/new';

  beforeEach(() => {
    // Connexion en tant qu'administrateur avant chaque test
    // Assurez-vous que la commande `cy.login()` est définie dans `cypress/support/commands.ts`
    cy.login('admin', 'admin');
    // Naviguer vers la page de la liste des entités
    cy.visit(entityPageUrl);
  });

  it('should load the TestEntities page and display its title', () => {
    // Vérifier que l'URL correspond à la page des entités
    cy.url().should('include', entityPageUrl);
    // Vérifier que le titre de la page est présent (basé sur la structure JHipster par défaut)
    cy.get('h2#page-heading').should('exist').and('contain', 'Test Entities'); // Adapter le texte 'Test Entities' au nom réel de votre entité
  });

  it('should display at least one entity in the table if available', () => {
    // Vérifier que le tableau des entités est présent
    cy.get('table.table').should('exist');
    // Vérifier qu'il y a au moins une ligne dans le corps du tableau (s'il y a des données)
    // Cela suppose que des données de test sont présentes ou que l'application en crée par défaut.
    cy.get('table tbody tr').its('length').should('be.gte', 0); // Peut être 0 si la liste est vide, ou au moins 1 si elle a des données.
  });

  it('should be able to navigate to the create new TestEntity page', () => {
    // Cliquer sur le bouton "Create a new Test Entity"
    cy.get('#jh-create-entity').click();
    // Vérifier que l'URL a changé pour la page de création
    cy.url().should('include', entityCreateUrl);
    // Vérifier que le titre de la page de création/édition est affiché
    cy.get('h2#createOrEditTestEntityHeading').should('exist').and('contain', 'Create or edit a Test Entity'); // Adapter le texte
    // Revenir en arrière pour les tests suivants
    cy.go('back');
  });

  // Les tests suivants nécessitent qu'au moins une entité existe dans la base de données.
  // Dans un environnement de CI/CD, cela est généralement géré par des fixtures ou des données de test insérées avant le démarrage des tests E2E.
  context('Given at least one existing TestEntity', () => {
    beforeEach(() => {
      // Assurez-vous qu'il y a au moins une entité pour les tests suivants
      // Si la base de données est vide, vous pouvez ajouter une étape ici pour créer une entité via l'API, par exemple:
      // cy.request('POST', '/api/test-entities', { name: 'Test Entity for E2E', ... }).then(() => cy.visit(entityPageUrl));
      // Pour cet exemple, nous partons du principe qu'une entité est déjà là ou que le test passera si la liste est vide.
      // Nous nous assurons d'abord qu'il y a au moins une ligne pour interagir avec elle.
      cy.get('table tbody tr').should('have.length.at.least', 1);
    });

    it('should be able to view an existing TestEntity', () => {
      // Cliquer sur le bouton "View" de la première entité de la liste
      cy.get('table tbody tr').first().find('[data-cy="entityDetailsButton"]').click();
      // Vérifier que l'URL correspond à la page de détails de l'entité (avec un ID à la fin)
      cy.url().should('match', new RegExp(`${entityPageUrl}\\/\\d+$`));
      // Vérifier que le titre de la page de détails est affiché
      cy.get('h2#testEntityDetailsHeading').should('exist').and('contain', 'Test Entity'); // Adapter le texte
      // Revenir en arrière pour les tests suivants
      cy.go('back');
    });

    it('should be able to edit an existing TestEntity', () => {
      // Cliquer sur le bouton "Edit" de la première entité de la liste
      cy.get('table tbody tr').first().find('[data-cy="entityEditButton"]').click();
      // Vérifier que l'URL correspond à la page d'édition de l'entité (avec un ID et '/edit' à la fin)
      cy.url().should('match', new RegExp(`${entityPageUrl}\\/\\d+\\/edit$`));
      // Vérifier que le titre de la page de création/édition est affiché
      cy.get('h2#createOrEditTestEntityHeading').should('exist').and('contain', 'Create or edit a Test Entity'); // Adapter le texte
      // Revenir en arrière pour les tests suivants
      cy.go('back');
    });

    it('should be able to delete an existing TestEntity', () => {
      // Cliquer sur le bouton "Delete" de la première entité de la liste
      cy.get('table tbody tr').first().find('[data-cy="entityDeleteButton"]').click();

      // Vérifier que la modale de confirmation de suppression apparaît
      cy.get('.modal-title').should('exist').and('contain', 'Confirm delete operation');
      cy.get('.modal-body').should('contain', 'Are you sure you want to delete Test Entity'); // Adapter le texte

      // Cliquer sur le bouton de confirmation de suppression
      cy.get('#jhi-confirm-delete-testEntity').click(); // L'ID est généralement 'jhi-confirm-delete-{entityNameMinusDash}'. Adapter 'testEntity'

      // Vérifier que le message de succès de suppression apparaît (toast message)
      cy.get('.toast-container .toast-success').should('exist').and('contain', 'A Test Entity is deleted with identifier'); // Adapter le texte
      // Vérifier que la modale de confirmation a disparu
      cy.get('.modal-dialog').should('not.exist');
    });
  });
});