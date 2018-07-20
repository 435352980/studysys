import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';

import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { withRouter } from 'react-router';
import { ConnectedRouter, routerMiddleware, routerReducer } from 'react-router-redux';
import createBrowserHistory from 'history/createBrowserHistory';

import * as reducers from './reducers';
import * as epicsMap from './epics';
import './lib/vintage'; //引入Echarts主题
import './style.less';

import Frame from './pages/Frame';

const history = createBrowserHistory();
const rm = routerMiddleware(history);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const allEpic = Object.values(epicsMap).reduce(
	(preVal, nextVal) => preVal.concat(Object.values(nextVal)),
	[]
);

const rootEpic = combineEpics(...allEpic);
const epicMiddleware = createEpicMiddleware({ dependencies: { axios } });

const store = createStore(
	combineReducers({ router: routerReducer, ...reducers }),
	{},
	composeEnhancers(applyMiddleware(rm, epicMiddleware))
);
epicMiddleware.run(rootEpic);

const FrameWithRouter = withRouter(Frame);

const App = props => (
	<Provider store={store}>
		<ConnectedRouter history={history}>{<FrameWithRouter />}</ConnectedRouter>
	</Provider>
);

render(<App />, document.getElementById('root'));
