const request = require('supertest');
const { expect, it, describe } = require('@jest/globals');

module.exports = function MovieIntegrationTestsPOST(app) {
	describe('Create Movie API integration tests', () => {
		it('POST /movies - should create a movie', async () => {
			/** @type {MovieModel} */
			const movie = {
				year: new Date().getFullYear(),
				title: 'test title',
				studios: 'test studio',
				producers: 'test producer',
				winner: true,
			};

			return await request(app)
				.post('/movies')
				.send(movie)
				.then((res) => {
					expect(res.body.data).toBeDefined();
					expect(res.body.data).toHaveProperty('id');
					expect(res.body.data).toHaveProperty('title');
					expect(res.body.data).toHaveProperty('producers');
					expect(res.body.data).toHaveProperty('studios');
					expect(res.body.data).toHaveProperty('winner');
					expect(res.body.data).toHaveProperty('year');
					expect(res.body.success).toEqual(true);
					expect(typeof res.body.data.winner).toEqual('boolean');
					expect(res.statusCode).toEqual(200);
				});
		});

		it('POST /movies - should fail for missing required field', async () => {
			/** @type {Partial<MovieDTO>} */
			const movie = {
				year: new Date().getFullYear(),
				producers: 'test producer',
				winner: 'yes',
			};

			return await request(app)
				.post('/movies')
				.send(movie)
				.then((res) => {
					expect(res.body.error).toBeDefined();
					expect(res.body.success).toEqual(false);
					expect(res.statusCode).toEqual(400);
				});
		});
	});
};
