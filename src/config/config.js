const fs = require('fs');

/**
 * @typedef {Object} Config
 * @property {number} port
 * @property {string} inputFilePath
 */

/**
 * @type {Config}
 */
const config = getEnvConfigFile();

function getEnvConfigFile() {
	const env = process.env.NODE_ENV || 'development';
	const envConfigFile = `./.env/${env}.env.json`;
	const content = fs.readFileSync(envConfigFile, 'utf8');
	return JSON.parse(content);
}

module.exports = config;
