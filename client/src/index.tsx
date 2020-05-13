import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose } from 'redux';
import { rootReducer } from './reducers/rootReducer';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk, logger)
    // @ts-ignore "Devtools hook into the window object"
    //   window.__REDUX_DEVTOOLS_EXTENSION__ &&
    //     // @ts-ignore "Devtools hook into the window object"
    //     window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true, traceLimit: 25 })
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
