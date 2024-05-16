


Cypress.Commands.add('renderDataSourceMenu', (dataSourceComponentType) => {
    // Clean all data sources
    cy.request('GET', `${BASE_PATH}${DS_API.DATA_SOURCES_LISTING}`).then(
      (resp) => {
        if (resp && resp.body && resp.body.saved_objects) {
          resp.body.saved_objects.map(({ id }) => {
            cy.request({
              method: 'DELETE',
              url: `${BASE_PATH}${DS_API.DELETE_DATA_SOURCE}${id}`,
              body: { force: false },
              headers: {
                'osd-xsrf': true,
              },
            });
          });
        }
      }
    );
  });
