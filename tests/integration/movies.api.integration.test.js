const { jest } = require('@jest/globals');

const MovieIntegrationTestsGET = require('./get_movie.api.integration.test');
const MovieIntegrationTestsPOST = require('./creaate_movie.api.integration.test');
const MovieIntegrationTestsPUT = require('./update_movie.api.integration.test');
const MovieIntegrationTestsDELETE = require('./delete_movie.api.integration.test');
const app = require('../../src/main');

jest.setTimeout(1000000);

MovieIntegrationTestsGET(app);
MovieIntegrationTestsPOST(app);
MovieIntegrationTestsPUT(app);
MovieIntegrationTestsDELETE(app);
