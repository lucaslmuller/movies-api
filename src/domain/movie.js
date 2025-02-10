/** @implements {MovieModel} */

module.exports = class Movie {
	/**@type {number} */
	id;
	/**@type {number} */
	year;
	/**@type {string} */
	title;
	/**@type {string} */
	studios;
	/**@type {string} */
	producers;
	/**@type {boolean} */
	winner;

	constructor(
		{ id, year, title, studios, producers, winner } = {
			id: 0,
			year: 0,
			title: '',
			studios: '',
			producers: '',
			winner: false,
		},
	) {
		this.id = id;
		this.year = year;
		this.title = title;
		this.studios = studios;
		this.producers = producers;
		this.winner = winner;
	}
};
