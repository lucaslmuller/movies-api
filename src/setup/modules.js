const MovieRepository = require('../repository/movieRepository');
const MovieService = require('../service/movieService');
const MovieController = require('../controller/movieController');
const MemoryStorage = require('../adapters/memory_storage/memory_storage');

module.exports = class MovieModule {
	init() {
		const storage = new MemoryStorage();
		const repository = new MovieRepository(storage);
		const service = new MovieService(repository);
		const controller = new MovieController(service);

		return { controller };
	}
};
