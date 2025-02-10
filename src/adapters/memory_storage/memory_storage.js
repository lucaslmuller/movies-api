const fs = require('fs');
const sqlite3 = require('sqlite3');
const config = require('../../config/config');
const Movie = require('../../domain/movie');

module.exports = class MemoryStorage {
	/** @type {import("sqlite3").Database} */
	db;

	constructor() {
		this.initDatabase();
		this.createTable();
		this.loadInitialData();

		process.on('exit', () => {
			this.db.close();
		});
	}

	initDatabase() {
		const v = sqlite3.verbose();

		this.db = new v.Database(':memory:', (err) => {
			if (err) {
				throw err;
			}
			if (process.env.NODE_ENV !== 'test') {
				console.log('Connected to the in-memory SQLite database.');
			}
		});
	}

	createTable() {
		this.db.serialize(() => {
			this.db.run(
				`CREATE TABLE movies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                year INTEGER,
                producers TEXT,
                studios TEXT,
                winner BOOLEAN
            );`,
				(err) => {
					if (err) {
						throw err;
					}
					if (process.env.NODE_ENV !== 'test') {
						console.log('Table created');
					}
				},
			);
		});
	}

	loadInitialData() {
		const data = fs.readFileSync(config.inputFilePath, 'utf8');
		const lines = data.split('\n');

		if (!lines || lines.length === 0) {
			return;
		}

		const headers = (lines.shift() || '').split(';');

		lines.forEach((line) => {
			if (!line) {
				return;
			}
			const values = line.split(';');
			const movie = new Movie();
			headers.forEach((header, index) => {
				switch (header) {
					case 'winner':
						// @ts-ignore
						movie[header] = Boolean(values[index] === 'yes');
						break;
					default:
						movie[header] = values[index];
				}
			});
			this.insert(movie);
		});
	}

	/**
	 * @param {MovieModel} movie
	 * @returns {Promise<MovieModel>}
	 */
	async insert(movie) {
		const keys = ['title', 'year', 'producers', 'studios', 'winner'];

		const values = [movie.title, movie.year, movie.producers, movie.studios, movie.winner];

		const query = `INSERT INTO movies (${keys.join(', ')}) VALUES (${values.map(() => '?').join(', ')})`;

		return new Promise((resolve, reject) => {
			this.db
				.prepare(query)
				.run(...values, function (err) {
					if (err) {
						return reject(err.message);
					}
					resolve({
						id: this.lastID,
						...movie,
					});
				})
				.finalize();
		});
	}

	/**
	 * @param {MovieModel['id']} id
	 * @returns {Promise<MovieModel>}
	 */
	getOneByID(id) {
		return new Promise(async (resolve, reject) => {
			this.db.all('SELECT * FROM movies WHERE id = ?', [id], (err, rows) => {
				if (err) {
					return reject(err.message);
				}
				resolve(rows[0] ? this.parseMovie(rows[0]) : null);
			});
		});
	}

	/**
	 * @param {number} page
	 * @param {number} perPage
	 * @returns {Promise<MovieModel[]>}
	 */
	getAllPaginated(page, perPage) {
		const promise = new Promise((resolve, reject) => {
			this.db
				.prepare('SELECT * FROM movies LIMIT ? OFFSET ?')
				.run(perPage, (page - 1) * perPage)
				.all((err, rows) => {
					if (err) {
						return reject(err.message);
					}
					resolve(rows.map((row) => this.parseMovie(row)));
				});
		});

		return promise;
	}

	/**
	 * @param {string} query
	 * @param {any[]} params
	 * @returns {Promise<MovieModel[]>}
	 */
	query(query, params = []) {
		const promise = new Promise((resolve, reject) => {
			this.db
				.prepare('SELECT * FROM movies WHERE ' + query)
				.run(...params)
				.all((err, rows) => {
					if (err) {
						return reject(err.message);
					}
					resolve(rows.map((row) => this.parseMovie(row)));
				});
		});

		return promise;
	}

	/**
	 * @returns {Promise<MovieModel[]>}
	 */
	getAll() {
		const promise = new Promise((resolve, reject) => {
			this.db.prepare('SELECT * FROM movies').all((err, rows) => {
				if (err) {
					return reject(err.message);
				}
				resolve(rows.map((row) => this.parseMovie(row)));
			});
		});

		return promise;
	}

	/**
	 * @param {MovieModel['id']} id
	 * @returns {Promise<boolean>}
	 */
	delete(id) {
		return new Promise(async (resolve, reject) => {
			this.db.all('DELETE FROM movies WHERE id = ?', [id], (err, rows) => {
				if (err) {
					return reject(err.message);
				}
				resolve(true);
			});
		});
	}

	/**
	 *
	 * @param {MovieModel['id']} id
	 * @param {MovieModel} movie
	 * @returns {Promise<MovieModel>}
	 */
	update(id, movie) {
		const keys = ['title', 'year', 'producers', 'studios', 'winner'];

		const values = [movie.title, movie.year, movie.producers, movie.studios, movie.winner];

		return new Promise(async (resolve, reject) => {
			const query = `UPDATE movies SET ${keys.map((key) => `${key} = ?`).join(', ')} WHERE id = ?`;
			this.db
				.prepare(query, (err) => {
					if (err) {
						return reject({ query, a: err.message });
					}
				})
				.run(...values, id)
				.finalize((err) => {
					if (err) {
						return reject(err.message);
					}
					resolve(
						this.parseMovie({
							id,
							...movie,
						}),
					);
				});
		});
	}

	/**
	 * @param {MovieModel} movie
	 * @returns {MovieModel}
	 */
	parseMovie(movie) {
		return {
			id: movie.id,
			title: movie.title,
			year: movie.year,
			producers: movie.producers,
			studios: movie.studios,
			winner: Boolean(movie.winner),
		};
	}
};
