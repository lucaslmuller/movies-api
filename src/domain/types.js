/**
 * @typedef {import('../repository/movieRepository')} MovieRepository
 */

/**
 * @typedef {import('../service/movieService')} MovieService
 */

/**
 * @typedef {import('../controller/movieController')} MovieController
 */

/**
 * @typedef {import('../utils/error')} CustomError
 */

/**
 * @typedef {Object} MovieDTO
 * @property {number} year
 * @property {string} title
 * @property {string} studios
 * @property {string} producers
 * @property {'yes'|'no'} winner
 */

/**
 * @typedef {Object} MovieModel
 * @property {number} [id]
 * @property {number} year
 * @property {string} title
 * @property {string} studios
 * @property {string} producers
 * @property {boolean} winner
 */
