module.exports = class MovieRepository {
	/**
	 * @type {import("../adapters/memory_storage/memory_storage")}
	 */
	storage;

	/**
	 * @param {import("../adapters/memory_storage/memory_storage")} storage
	 */
	constructor(storage) {
		this.storage = storage;
	}

	/**
	 * @param {number} page
	 * @param {number} perPage
	 * @returns {Promise<MovieModel[]>}
	 */
	getAllPaginated(page, perPage) {
		return this.storage.getAllPaginated(page, perPage);
	}

	/**
	 * @param {string} query
	 * @param {any[]} params
	 * @returns {Promise<MovieModel[]>}
	 */
	query(query, ...params) {
		return this.storage.query(query, params);
	}

	/**
	 * @returns {Promise<MovieModel[]>}
	 */
	getAll() {
		return this.storage.getAll();
	}

	/**
	 * @param {MovieModel['id']} id
	 * @returns {Promise<MovieModel>}
	 */
	get(id) {
		return this.storage.getOneByID(id);
	}

	/**
	 * @param {MovieModel} movie
	 * @returns {Promise<MovieModel>}
	 */
	async create(movie) {
		return this.storage.insert(movie);
	}

	/**
	 * @param {MovieModel['id']} id
	 * @param {MovieModel} movie
	 * @returns {Promise<MovieModel>}
	 */
	async update(id, movie) {
		return this.storage.update(id, movie);
	}

	/**
	 * @param {MovieModel['id']} id
	 */
	delete(id) {
		return this.storage.delete(id);
	}
};
