const commonConfig = require('./jest.config');

const config = {
	...commonConfig,
	testMatch: ['**/*movies.api.integration.test.js'],
	coverageDirectory: 'coverage/integration',
};

module.exports = config;
