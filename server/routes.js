const indexRouter = require('./route/index');
const feedsRouter = require('./route/feeds');
const exploreRoute = require('./route/explore');
const createRoute = require('./route/create');
const signInRoute = require('./route/sign-in');
const updater = require('./route/updater');

module.exports = function routes(app) {
	app.use(`/${app.locals.version}/feeds`, feedsRouter);
	app.use(`/${app.locals.version}/explore`, exploreRoute);
	app.use(`/${app.locals.version}/create`, createRoute);
	app.use(`/${app.locals.version}/sign-in`, signInRoute);
	app.use(`/${app.locals.version}`, indexRouter);
	app.use('/updater', updater);
};