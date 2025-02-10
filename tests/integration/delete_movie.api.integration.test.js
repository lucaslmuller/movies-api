const request = require('supertest');
const { expect, it, describe } = require('@jest/globals');

module.exports = function MovieIntegrationTestsDELETE(app) {
	describe('Delete Movie API integration tests', () => {
		it('DELETE /movies/:id - should delete movie by id', async () => {
			const id = 1;
			return await request(app)
				.delete(`/movies/${id}`)
				.then((res) => {
					expect(res.body.data).toBeDefined();
					expect(res.body.success).toEqual(true);
					expect(res.body.data).toEqual(true);
					expect(res.statusCode).toEqual(200);
				});
		});

		it('DELETE /movies/:id - should fail to delete movie due to movie not found', async () => {
			const id = -1;
			return await request(app)
				.delete(`/movies/${id}`)
				.then((res) => {
					expect(res.body.error).toBeDefined();
					expect(res.body.success).toEqual(false);
					expect(res.statusCode).toEqual(404);
				});
		});
	});
};
