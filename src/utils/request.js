const https = require('https');
const CustomError = require('./error');

module.exports = class Request {
	static async get(url) {
		return Request.requestWithBody(url, 'GET');
	}

	static async post(url, body) {
		return Request.requestWithBody(url, 'POST', body || {});
	}

	static async put(url, body) {
		return Request.requestWithBody(url, 'PUT', body || {});
	}

	static async delete(url, body) {
		return Request.requestWithBody(url, 'DELETE', body || {});
	}

	static requestWithBody(url, method, body) {
		const options = {
			method,
		};

		if (body) {
			const postData = JSON.stringify(body);
			options.body = postData;
			options.headers = {
				'Content-Type': 'application/json',
				'Content-Length': postData.length,
			};
		}

		return new Promise((resolve, reject) => {
			https
				.request(url, options, (response) => {
					let data = '';

					response.on('data', (chunk) => {
						data += chunk;
					});

					response.on('end', () => {
						resolve(JSON.parse(data || '{}'));
					});
				})
				.on('error', (error) => {
					reject(error);
				});
		});
	}

	static checkMissingFields(fields, object) {
		const missingFields = fields.filter((field) => !object[field]);
		if (missingFields.length) {
			return new CustomError(400, `Missing fields: ${missingFields.join(', ')}`);
		}
	}
};
