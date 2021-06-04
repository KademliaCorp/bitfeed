const feedsRouter = require('../route/my-feeds');
const exploreRoute = require('../route/explore');
const createRoute = require('../route/create');
const signInRoute = require('../route/sign-in');
const serviceWorkerRoute = require('../route/service-worker');
const updater = require('../route/updater');
const signOut = require('../route/sign-out');

module.exports = function routes(app) {
	app.use(`/my-feeds`, feedsRouter);
	app.use(`/explore`, exploreRoute);
	app.use(`/create`, createRoute);
	app.use(`/sign-in`, signInRoute);
	app.use(`/service-worker`, serviceWorkerRoute);
	app.use('/updater', updater);
	app.use('/sign-out', signOut);
};