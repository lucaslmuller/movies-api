const CustomError = require("../utils/error");

module.exports = class MovieService {
  /**
   * @param {MovieRepository} repository
   */
  repository;

  /**
   * @param {MovieRepository} repository
   */
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * @returns {Promise<{ min: Stat[], max: Stat[] }>}
   */
  async getStats() {
    const yearsGroupedByProducer = await this.getMoviesGroupedByProducer();

    let producersMinInterval = Number.MAX_SAFE_INTEGER;
    let producersMaxInterval = Number.MIN_SAFE_INTEGER;

    /** @type {Record<number, Stat[]>} */
    const producersByMin = {};

    /** @type {Record<number, Stat[]>} */
    const producersByMax = {};

    Object.keys(yearsGroupedByProducer).forEach((producer) => {
      if (yearsGroupedByProducer[producer].length == 1) {
        delete yearsGroupedByProducer[producer];
        return;
      }

      yearsGroupedByProducer[producer] = (
        yearsGroupedByProducer[producer] || []
      ).sort((a, b) => a - b);

      const producerIntervalMinMax = this.getProducerIntervalMinMax(
        producer,
        yearsGroupedByProducer[producer]
      );

      if (producerIntervalMinMax.min.interval < producersMinInterval) {
        producersMinInterval = producerIntervalMinMax.min.interval;
      }

      if (producerIntervalMinMax.max.interval > producersMaxInterval) {
        producersMaxInterval = producerIntervalMinMax.max.interval;
      }

      producersByMin[producerIntervalMinMax.min.interval] ??= [];
      producersByMax[producerIntervalMinMax.max.interval] ??= [];

      producersByMin[producerIntervalMinMax.min.interval].push(
        ...producerIntervalMinMax.min.stats
      );
      producersByMax[producerIntervalMinMax.max.interval].push(
        ...producerIntervalMinMax.max.stats
      );
    });

    return {
      min: producersByMin[producersMinInterval],
      max: producersByMax[producersMaxInterval],
    };
  }

  /**
   * @param {MovieModel['id']} id
   * @returns {Promise<MovieModel>}
   */
  async getByID(id) {
    const movie = await this.repository.get(id);
    return movie;
  }

  /**
   * @param {number} page
   * @param {number} perPage
   * @returns {Promise<MovieModel[]>}
   */
  async getAllPaginated(page, perPage) {
    const movies = await this.repository.getAllPaginated(page, perPage);
    return movies;
  }

  /**
   * @param {MovieModel} movie
   * @returns {Promise<MovieModel>}
   */
  async create(movie) {
    const createdMovie = await this.repository.create(movie);
    return createdMovie;
  }

  /**
   * @param {MovieModel['id']} id
   * @param {MovieModel} movie
   * @returns {Promise<[MovieModel, CustomError|null]>}
   */
  async update(id, movie) {
    const currentMovie = await this.repository.get(id);

    if (!currentMovie) {
      return [null, new CustomError(404, "Movie not found")];
    }
    const updatedMovie = await this.repository.update(id, movie);
    return [updatedMovie, null];
  }

  /**
   * @param {MovieModel['id']} id
   * @returns {Promise<[boolean, CustomError|null]>}
   */
  async delete(id) {
    const movie = await this.repository.get(id);

    if (!movie) {
      return [null, new CustomError(404, "Movie not found")];
    }

    const deletedMovie = await this.repository.delete(id);

    return [deletedMovie, null];
  }

  /**
   * @returns {Promise<Record<MovieModel['producers'], MovieModel['year'][]>>}
   */
  async getMoviesGroupedByProducer() {
    /** @type {Record<MovieModel['producers'], MovieModel['year'][]>} */
    const result = {};
    const movies = await this.repository.query("winner = 1");

    movies.forEach((movie) => {
      const producers = movie.producers;
      this.parseProducers(producers).forEach((producer) => {
        result[producer] ??= [];
        result[producer].push(movie.year);
      });
    });

    return result;
  }

  /**
   * @typedef Stat
   * @property {number} interval
   * @property {string} producer
   * @property {number} previousWin
   * @property {number} followingWin
   */

  /**
   * @param {string} producer
   * @param {MovieModel['year'][]} years
   * @returns {{ min: {interval: number; stats: Stat[]}, max: {interval: number; stats: Stat[]} }}
   */
  getProducerIntervalMinMax(producer, years) {
    /** @type {number} */
    let min = Number.MAX_SAFE_INTEGER;

    /** @type {number} */
    let max = Number.MIN_SAFE_INTEGER;

    /** @type {Record<number, Stat[]>} */
    const groupedByDelta = {};

    let l = 0;

    while (l + 1 < years.length) {
      const r = l + 1;
      const delta = years[r] - years[l];

	  groupedByDelta[delta] ??= [];
      groupedByDelta[delta].push({
        producer,
        interval: delta,
        previousWin: years[l],
        followingWin: years[r],
      });

      min = Math.min(min, delta);
      max = Math.max(max, delta);

      l++;
    }

    return {
      min: {
        interval: min,
        stats: groupedByDelta[min],
      },
      max: {
        interval: max,
        stats: groupedByDelta[max],
      },
    };
  }

  parseProducers(producers) {
    return producers.split(/,\s*|\s+and\s+/);
  }
};
