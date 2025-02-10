const Request = require('../utils/request');
const Response = require('../utils/response');

module.exports = class MovieController {
	/**
	 * @param {MovieService} service
	 */
	service;

	/**
	 * @param {MovieService} service
	 */
	constructor(service) {
		this.service = service;
	}

	async getMovies(req, res) {
		const [page, perPage] = [Number(req.query.page || '1'), Number(req.query.per_page || '10')];
		const movies = await this.service.getAllPaginated(page, perPage);

		Response.Success(res, {
			success: true,
			data: movies,
		});
	}

	async getProducersStats(req, res) {
		const stats = await this.service.getStats();

		Response.Success(res, stats);
	}

	async getMovie(req, res) {
		const movie = await this.service.getByID(Number(req.params.id));

		if (!movie) {
			Response.Error(res, 404, 'Movie not found');
			return;
		}

		Response.Success(res, {
			success: true,
			data: movie,
		});
	}

	async createMovie(req, res) {
		/** @type {MovieModel} */
		const input = req.body;
		const err = Request.checkMissingFields(['title', 'year', 'producers', 'studios', 'winner'], input);

		if (err) {
			Response.Error(res, 400, err);
			return;
		}

		const createdMovie = await this.service.create(input);

		Response.Success(res, {
			success: true,
			data: createdMovie,
		});
	}

	async deleteMovie(req, res) {
		const [deleted, err] = await this.service.delete(Number(req.params.id));

		if (err) {
			Response.Error(res, err.code, err.message);
			return;
		}

		Response.Success(res, {
			success: true,
			data: deleted,
		});
	}

	async updateMovie(req, res) {
		/** @type {MovieModel} */
		const input = req.body;

		const validationErr = Request.checkMissingFields(['title', 'year', 'producers', 'studios', 'winner'], input);

		if (validationErr) {
			Response.Error(res, validationErr.code, validationErr.message);
			return;
		}

		const [updated, err] = await this.service.update(Number(req.params.id), input);

		if (err) {
			Response.Error(res, err.code, err.message);
			return;
		}

		Response.Success(res, {
			success: true,
			data: updated,
		});
	}
};
