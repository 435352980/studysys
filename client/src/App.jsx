import React from 'react';
import { render } from 'react-dom';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';

import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { withRouter } from 'react-router';
import { ConnectedRouter, routerMiddleware, routerReducer } from 'react-router-redux';
import createBrowserHistory from 'history/createBrowserHistory';
// import createMemoryHistory from 'history/createMemoryHistory';

import chartsReducer from './reducers/chartsReducer';
import vouchReducer from './reducers/vouchReducer';
import chartsEpic from './epics/chartsEpic';
import vouchEpic from './epics/vouchEpic';
import './lib/vintage'; //引入Echarts主题
import Frame from './pages/Frame';
import './style.less';

const history = createBrowserHistory();
// const history = createMemoryHistory();
const rm = routerMiddleware(history);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootEpic = combineEpics(chartsEpic, vouchEpic);
const epicMiddleware = createEpicMiddleware();

const store = createStore(
	combineReducers({ router: routerReducer, charts: chartsReducer, vouch: vouchReducer }),
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
