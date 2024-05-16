/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { BASE_PATH } from '../../base_constants';

// Data
export const TSVB_INDEX_DATA = 'metrics.data.txt';
export const TSVB_PATH_FIXTURE =
  'dashboard/opensearch_dashboards/vis_type_tsvb/';
export const TSVB_PATH_INDEX_DATA = TSVB_PATH_FIXTURE + TSVB_INDEX_DATA;
export const TSVB_INDEX_START_TIME = 'Dec 31, 2021 @ 00:00:00.000';
export const TSVB_INDEX_END_TIME = 'Oct 2, 2022 @ 00:00:00.000';
export const TSVB_INDEX_ID = 'vis-metrics';
export const TSVB_INDEX_PATTERN = 'index-pattern-vis-metrics';

// App URL Paths
export const VIS_APP_PATH = '/app/visualize';
export const TSVB_CREATE_URL = `${BASE_PATH}${VIS_APP_PATH}#/create?type=metrics`;