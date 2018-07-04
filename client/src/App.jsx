import React from 'react';
import { render } from 'react-dom';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';

import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { withRouter } from 'react-router';
import { ConnectedRouter, routerMiddleware, routerReducer } from 'react-router-redux';
import createBrowserHistory from 'history/createBrowserHistory';

import chartsReducer from './reducers/chartsReducer';
import chartsEpic from './epics/chartsEpic';
import './lib/vintage'; //引入Echarts主题
import Frame from './pages/Frame';

const history = createBrowserHistory();
const rm = routerMiddleware(history);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootEpic = combineEpics(chartsEpic);
const epicMiddleware = createEpicMiddleware();

const store = createStore(
	combineReducers({ router: routerReducer, charts: chartsReducer }),
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
