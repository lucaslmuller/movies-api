const config = {
	testEnvironment: 'node',
	collectCoverage: true,
	coverageDirectory: 'coverage',
	testMatch: [],
	transformIgnorePatterns: ['[/\\\\\\\\]node_modules[/\\\\\\\\].+\\\\.(js|ts)$'],
	transform: {},
	coveragePathIgnorePatterns: ['/node_modules/'],
};

module.exports = config;
