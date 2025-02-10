const App = require('./setup/setup');

const app = new App();

module.exports = app.expressApp;
