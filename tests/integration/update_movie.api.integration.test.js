const request = require('supertest');
const { expect, it, describe } = require('@jest/globals');

module.exports = function MovieIntegrationTestsPUT(app) {
	describe('Update Movie API integration tests', () => {
		it('PUT /movies/:id - should update movie by id', async () => {
			const id = 1;
			/** @type {MovieDTO} */
			const movie = {
				year: new Date().getFullYear(),
				title: 'test title',
				studios: 'test studio',
				producers: 'test producer',
				winner: 'yes',
			};
			return await request(app)
				.put(`/movies/${id}`)
				.send(movie)
				.then((res) => {
					expect(res.body.data).toBeDefined();
					expect(res.body.success).toEqual(true);
					expect(res.statusCode).toEqual(200);
				});
		});

		it('PUT /movies/:id - should fail to update movie due to movie not found', async () => {
			const id = -1;
			/** @type {MovieDTO} */
			const movie = {
				year: new Date().getFullYear(),
				title: 'test title',
				studios: 'test studio',
				producers: 'test producer',
				winner: 'yes',
			};
			return await request(app)
				.put(`/movies/${id}`)
				.send(movie)
				.then((res) => {
					expect(res.body.error).toBeDefined();
					expect(res.body.success).toEqual(false);
					expect(res.statusCode).toEqual(404);
				});
		});
	});
};
