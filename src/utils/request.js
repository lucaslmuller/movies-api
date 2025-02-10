const CustomError = require('./error');

module.exports = class Request {
	static checkMissingFields(fields, object) {
		const missingFields = fields.filter((field) => !object[field]);
		if (missingFields.length) {
			return new CustomError(400, `Missing fields: ${missingFields.join(', ')}`);
		}
	}
};
