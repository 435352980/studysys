import React from 'react';

import { render } from 'react-dom';
import Frame from './pages/Frame';

const App = props => <div>{<Frame />}</div>;

render(<App />, document.getElementById('root'));
