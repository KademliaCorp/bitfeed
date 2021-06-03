const indexRouter = require('../route/index');
const feedsRouter = require('../route/feeds');
const exploreRoute = require('../route/explore');
const createRoute = require('../route/create');
const signInRoute = require('../route/sign-in');
const serviceWorkerRoute = require('../route/service-worker');
const updater = require('../route/updater');

module.exports = function routes(app) {
	app.use(`/feeds`, feedsRouter);
	app.use(`/explore`, exploreRoute);
	app.use(`/create`, createRoute);
	app.use(`/sign-in`, signInRoute);
	app.use(`/service-worker`, serviceWorkerRoute);
	app.use('/updater', updater);
	app.use(``, indexRouter);
};