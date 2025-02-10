module.exports = class Response {
	static Success(res, data) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(data));
	}
	static Error(res, code, message) {
		res.writeHead(code, { 'Content-Type': 'application/json' });
		res.end(
			JSON.stringify({
				success: false,
				error: message,
			}),
		);
	}
};
