import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import App from './core/App';
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: "https://893e0691d7fb498d860c8644cb0137c9@sentry.io/1727463"
});


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
