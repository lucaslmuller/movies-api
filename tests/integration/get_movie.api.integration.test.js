const request = require('supertest');
const { expect, it, describe } = require('@jest/globals');

module.exports = function MovieIntegrationTestsGET(app) {
	describe('Get Movie API integration tests', () => {
		it('GET /movies - should fetch movies', async () => {
			return await request(app)
				.get('/movies?per_page=999999')
				.then((res) => {
					expect(res.body.data).toBeDefined();
					expect(res.body.success).toEqual(true);
					expect(Array.isArray(res.body.data)).toBeTruthy();
					expect(res.body.data.length).toBeGreaterThan(0);

					res.body.data.map((movie) => {
						expect(movie).toHaveProperty('id');

						expect(movie).toHaveProperty('title');
						expect(movie.title).not.toBeFalsy();

						expect(movie).toHaveProperty('producers');
						expect(movie.producers).not.toBeFalsy();

						expect(movie).toHaveProperty('studios');
						expect(movie.studios).not.toBeFalsy();

						expect(movie).toHaveProperty('winner');
						expect(typeof movie.winner).toEqual('boolean');

						expect(movie).toHaveProperty('year');
						expect(movie.producers).not.toBeFalsy();
						expect(typeof movie.year).toEqual('number');
					})

					expect(res.statusCode).toEqual(200);

				});
		});

		it('GET /movies/:id - should fetch movie by id', async () => {
			const id = 1;
			return await request(app)
				.get(`/movies/${id}`)
				.then((res) => {
					expect(res.body.data).toBeDefined();
					expect(res.body.success).toEqual(true);
					expect(res.body.data).toHaveProperty('id');
					expect(res.body.data).toHaveProperty('title');
					expect(res.body.data).toHaveProperty('producers');
					expect(res.body.data).toHaveProperty('studios');
					expect(res.body.data).toHaveProperty('winner');
					expect(res.body.data).toHaveProperty('year');
					expect(res.statusCode).toEqual(200);
				});
		});

		it('GET /movies/:id - should fail to fetch movie by id', async () => {
			const id = -1;
			return await request(app)
				.get(`/movies/${id}`)
				.then((res) => {
					expect(res.body.error).toBeDefined();
					expect(res.body.success).toEqual(false);
					expect(res.statusCode).toEqual(404);
				});
		});

		it('GET /movies/stats - should retrieve stats', async () => {
			return await request(app)
				.get('/movies/stats')
				.then((res) => {
					expect(res.body.min).toBeDefined();
					expect(res.body.max).toBeDefined();
					expect(Array.isArray(res.body.min)).toBeTruthy();
					expect(Array.isArray(res.body.max)).toBeTruthy();

					res.body.min.map((stat) => {
						expect(stat).toHaveProperty('producer');
						expect(stat).toHaveProperty('interval');
						expect(stat).toHaveProperty('previousWin');
						expect(stat).toHaveProperty('followingWin');
					});

					res.body.max.map((stat) => {
						expect(stat).toHaveProperty('producer');
						expect(stat).toHaveProperty('interval');
						expect(stat).toHaveProperty('previousWin');
						expect(stat).toHaveProperty('followingWin');
					});

					expect(res.statusCode).toEqual(200);
				});
		});
	});
};
