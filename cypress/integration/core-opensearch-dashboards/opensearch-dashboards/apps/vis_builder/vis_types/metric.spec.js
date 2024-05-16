/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  VB_APP_URL,
  VB_INDEX_END_TIME,
  VB_INDEX_ID,
  VB_INDEX_PATTERN,
  VB_INDEX_START_TIME,
  VB_PATH_INDEX_DATA,
  VB_PATH_SO_DATA,
  VB_INDEX_DOC_COUNT
} from '../../../../../../utils/constants';
import { CURRENT_TENANT } from '../../../../../../utils/commands';

if (Cypress.env('VISBUILDER_ENABLED')) {
  describe('Vis Builder: Metric Chart', () => {
    before(() => {
      CURRENT_TENANT.newTenant = 'global';
      cy.fleshTenantSettings();
      cy.deleteIndex(VB_INDEX_ID);
      cy.bulkUploadDocs(VB_PATH_INDEX_DATA);
      cy.importSavedObjects(VB_PATH_SO_DATA);

      cy.visit(VB_APP_URL);

      // Wait for page to load
      cy.waitForLoader();
      cy.vbSelectDataSource(VB_INDEX_PATTERN);

      // Set Top nav
      cy.setTopNavDate(VB_INDEX_START_TIME, VB_INDEX_END_TIME);

      cy.vbSelectVisType('Metric');
    });

    it('Basic test', () => {
      cy.getElementByTestId('field-undefined-showDetails').drag(
        '[data-test-subj="dropBoxAddField-metric"]'
      );
      testMetric('10,000');
    });

    after(() => {
      cy.deleteIndex(VB_INDEX_ID);
    });
  });
}

if (Cypress.env('DATASOURCE_MANAGEMENT_ENABLED')) {
  describe('Vis Builder: Metric Chart with MDS', () => {
    before(() => {
      cy.deleteAllDataSources();
      let dataSourceId;
      let dataSourceTitle;

      console.log("BBBBBBBBBBBBefore")

      cy.createDataSourceNoAuth().then((result) => {
        console.log("result", result)
        // dataSourceId = result[0];
        // dataSourceTitle = result[1];
      });

      console.log("AAAAAAAAfter")



      CURRENT_TENANT.newTenant = 'global';
      cy.fleshTenantSettings();
      cy.deleteIndex(VB_INDEX_ID);
      cy.bulkUploadDocs(VB_PATH_INDEX_DATA);
      cy.importSavedObjects(VB_PATH_SO_DATA);

      cy.visit(VB_APP_URL);

      // Wait for page to load
      cy.waitForLoader();
      cy.vbSelectDataSource(VB_INDEX_PATTERN);

      // Set Top nav
      cy.setTopNavDate(VB_INDEX_START_TIME, VB_INDEX_END_TIME);

      cy.vbSelectVisType('Metric');
    });

    after(() => {
      // let dataSourceId;
      // let dataSourceTitle;

      // console.log("BBBBBBBBBBBBefore")

      // cy.().then((result) => {
      //   console.log("result", result)
      //   // dataSourceId = result[0];
      //   // dataSourceTitle = result[1];
      // });

      // console.log("AAAAAAAAfter")
      cy.log("LLLLLLLLL")
    });

    it('Can create metric with MDS', () => {
      // cy.getElementByTestId('field-undefined-showDetails').drag(
      //   '[data-test-subj="dropBoxAddField-metric"]'
      // );
      // testMetric('10,000');
      cy.getElementByTestId('field-undefined-showDetails').drag(
        '[data-test-subj=dropBoxAddField-metric]'
      );
      cy.getElementByTestId('visualizationLoader')
        .find('.mtrVis__value')
        .should('contain.text', VB_INDEX_DOC_COUNT);

      // Update Topnav
      cy.setTopNavQuery('salary < 15000');

      // See if the value updated
      cy.getElementByTestId('visualizationLoader')
        .find('.mtrVis__value')
        .should('contain.text', `5,000`);
      cy.getElementByTestId('timeSeriesEditorPanelOptionsBtn').click();
      // cy.getElementByTestId('dataSourceSelectorComboBox').should()
    });

    after(() => {
      cy.deleteIndex(VB_INDEX_ID);
    });
  });
}

export const testMetric = (value) => {
  cy.getElementByTestId('visualizationLoader')
    .find('.mtrVis__value')
    .should('contain.text', value);
};
