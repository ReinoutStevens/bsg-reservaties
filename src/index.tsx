import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase/app';
import App from './core/App';

const firebaseConfig = {
  apiKey: "AIzaSyAapSOfqtY7sbJ3K4M6ThArErrKQvqZFDE",
  authDomain: "bsg-reservaties.firebaseapp.com",
  databaseURL: "https://bsg-reservaties.firebaseio.com",
  projectId: "bsg-reservaties",
  storageBucket: "",
  messagingSenderId: "94895921934",
  appId: "1:94895921934:web:ae5be6e1f73f76f9"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
