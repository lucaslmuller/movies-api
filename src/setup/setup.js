const express = require('express');
const MovieModule = require('./modules');
const config = require('../config/config');
const path = require('path');

module.exports = class App {
	/** @type {import("express").Application} */
	expressApp;
	/** @type {MovieController} */
	controller;
	constructor() {
		this.controller = this.initModules();
		this.expressApp = this.startServer();
	}
	initModules() {
		const { controller } = new MovieModule().init();
		return controller;
	}

	startServer() {
		const app = express();
		app.use(express.json());
		this.setupRoutes(app);
		app.listen(config.port, () => {
			if (process.env.NODE_ENV !== 'test') {
				console.log(`Server running on port ${config.port}`);
			}
		});
		return app;
	}

	setupRoutes(app) {
		app.get('/health-check', (req, res) => {
			res.status(200).json({
				success: true,
				data: 'OK',
			});
		});

		app.get('/movies', (req, res) => this.controller.getMovies(req, res));
		app.get('/movies/stats', (req, res) => this.controller.getProducersStats(req, res));
		app.get('/movies/:id', (req, res) => this.controller.getMovie(req, res));
		app.post('/movies', (req, res) => this.controller.createMovie(req, res));
		app.delete('/movies/:id', (req, res) => this.controller.deleteMovie(req, res));
		app.put('/movies/:id', (req, res) => this.controller.updateMovie(req, res));

		app.use((req, res) => {
			res.status(404).json({
				success: false,
				error: 'Route not found',
			});
		});
	}
};
