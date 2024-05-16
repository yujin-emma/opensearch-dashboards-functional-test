/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import _ from 'lodash';
import { CURRENT_TENANT } from '../../../../../utils/commands';
import { DS_BASIC_AUTH_LABEL } from '../../../../../utils/dashboards/datasource-management-dashboards-plugin/constants';
import { TSVB_INDEX_ID, TSVB_PATH_INDEX_DATA, TSVB_CREATE_URL, VIS_APP_PATH, TSVB_INDEX_START_TIME, TSVB_INDEX_END_TIME, TSVB_INDEX_PATTERN } from '../../../../../utils/dashboards/vis_type_tsvb/constants';
// import {
//     VB_APP_URL,
//     VB_INDEX_END_TIME,
//     VB_INDEX_ID,
//     VB_INDEX_PATTERN,
//     VB_INDEX_START_TIME,
//     VB_PATH_INDEX_DATA,
//     VB_PATH_SO_DATA,
//     // VB_INDEX_DOC_COUNT
//   } from '../../../../../utils/constants';

describe('TSVB Visualization', () => {
//   const updateVegaSpec = ({
//     dataSourceName,
//     indexName,
//     isDataFieldAnArray,
//     spec,
//   }) => {
//     const newSpec = _.cloneDeep(spec);
//     if (isDataFieldAnArray) {
//       if (dataSourceName) {
//         newSpec.data[0].url.data_source_name = dataSourceName;
//       }
//       newSpec.data[0].url.index = indexName;
//     } else {
//       if (dataSourceName) {
//         newSpec.data.url.data_source_name = dataSourceName;
//       }
//       newSpec.data.url.index = indexName;
//     }

//     return newSpec;
//   };

  before(() => {
    cy.log("at the very beginning");

    CURRENT_TENANT.newTenant = 'global';
    cy.fleshTenantSettings();
    cy.log("1 ------- fleshTenantSettings");

    cy.deleteIndex(TSVB_INDEX_ID);
    cy.log("2 ------- deleteIndex");

    cy.bulkUploadDocs(TSVB_PATH_INDEX_DATA);

    cy.log("3 ------- bulkUploadDocs");


    // Dashboards requires an index pattern to continue to the Create Visualization stage
    cy.deleteIndexPattern(TSVB_INDEX_PATTERN);
    cy.log("4 ------- deleteIndexPattern");

    cy.createIndexPattern(TSVB_INDEX_PATTERN, {
      title: TSVB_INDEX_ID,
      timeFieldName: 'timestamp',
    });
    cy.log("5 ------- createIndexPattern");


    // Visit the page
    cy.log('create a new tsvb visualization: ', TSVB_CREATE_URL);
    cy.visit(TSVB_CREATE_URL);
    cy.log("6 ------- TSVB_CREATE_URL");

    cy.url().should('contain', VIS_APP_PATH);

    cy.setTopNavDate(TSVB_INDEX_START_TIME, TSVB_INDEX_END_TIME);

    // Wait for page to load
    cy.waitForLoader();
  });

  if (Cypress.env('DATASOURCE_MANAGEMENT_ENABLED')) {
    // before(() => {
    //   cy.deleteDataSourceIndexBasicAuth(TSVB_INDEX_ID);
    //   cy.deleteDataSourceIndexBasicAuth(TSVB_INDEX_ID);

    //   cy.createDataSourceBasicAuth();
    //   cy.bulkUploadDocsToDataSourceBasicAuth(TSVB_PATH_INDEX_DATA);
    // });

    describe('When MDS is enabled', () => {
      [
        {
          dataSourceName: DS_BASIC_AUTH_LABEL,
          canvasExists: 'exist',
          vegaVisMessagesExists: 'not.exist',
        },
        // {
        //   dataSourceName: 'non-existent datasource',
        //   canvasExists: 'not.exist',
        //   vegaVisMessagesExists: 'exist',
        // },
      ].forEach(({ dataSourceName, canvasExists, vegaVisMessagesExists }) => {
        it(`should query data from ${dataSourceName} and resulting visualization should ${canvasExists}`, () => {
        //   const updatedVegaSpec = updateVegaSpec({
        //     dataSourceName,
        //     indexName: TSVB_INDEX_ID,
        //     isDataFieldAnArray: false,
        //     spec: vegaSpec,
        //   });

        //   cy.vegaSetVegaSpec(updatedVegaSpec);
        cy.log("before clicking the panel options ")
        cy.contains('button', 'Panel options').click();
        cy.log("clicked the button to switch the panel")
        cy.contains('label', 'Data source');
        cy.get('[data-test-subj="dataSourceSelectorComboBox"]')
          .select('RemoteDataSourceBasicAuth');
        cy.log("not yet submit the request")
        cy.get('input[data-test-subj="metricsIndexPatternInput"]')
        .type('TSVB_INDEX_ID');
          cy.tsvbSaveVisualization();

          cy.get('canvas.marks').should(canvasExists);
        //   cy.get('ul.vgaVis__messages').should(vegaVisMessagesExists);
        });
      });

    //   it('should query from local cluster when data_source_name is not present', () => {
    //     const updatedVegaSpec = updateVegaSpec({
    //       indexName: VEGA_INDEX_ID,
    //       isDataFieldAnArray: false,
    //       spec: vegaSpec,
    //     });

    //     cy.vegaSetVegaSpec(updatedVegaSpec);
    //     cy.vegaUpdateVisualization();

    //     // Visualization should be drawn; correct visualizations do not have warning messages
    //     cy.get('canvas.marks').should('exist');
    //     cy.get('ul.vgaVis__messages').should('not.exist');
    //   });
    });
  } else {
    // describe('When MDS is disabled', () => {
    //   it('should throw an error when data_source_name is used', () => {
    //     const updatedVegaSpec = updateVegaSpec({
    //       dataSourceName: 'non-existent datasource',
    //       indexName: VEGA_INDEX_ID,
    //       isDataFieldAnArray: false,
    //       spec: vegaSpec,
    //     });

    //     cy.vegaSetVegaSpec(updatedVegaSpec);
    //     cy.vegaUpdateVisualization();

    //     // Visualization shouldn't exist; banner should exist
    //     cy.get('canvas.marks').should('not.exist');
    //     cy.get('ul.vgaVis__messages').should('exist');
    //   });

    //   it('should query from local cluster when data_source_name is not present', () => {
    //     const updatedVegaSpec = updateVegaSpec({
    //       indexName: VEGA_INDEX_ID,
    //       isDataFieldAnArray: false,
    //       spec: vegaSpec,
    //     });

    //     cy.vegaSetVegaSpec(updatedVegaSpec);
    //     cy.vegaUpdateVisualization();

    //     // Visualization should be drawn; correct visualizations do not have warning messages
    //     cy.get('canvas.marks').should('exist');
    //     cy.get('ul.vgaVis__messages').should('not.exist');
    //   });
    // });
  }

  after(() => {
    cy.deleteIndex(TSVB_INDEX_ID);
    cy.deleteIndexPattern(TSVB_INDEX_PATTERN);

    if (Cypress.env('DATASOURCE_MANAGEMENT_ENABLED')) {
      cy.deleteDataSourceIndexBasicAuth(TSVB_INDEX_ID);
      cy.deleteAllDataSources();
    }
  });
});