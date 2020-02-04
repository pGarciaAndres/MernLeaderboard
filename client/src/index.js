import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';
import 'semantic-ui-css/semantic.min.css';
import './index.css';

//Firebase configuration
firebase.initializeApp({
    apiKey: "AIzaSyAvx2aAGLyy7fwebLHNakrUrarTVp-j-xw",
    authDomain: "reactfirebase-d23fe.firebaseapp.com",
    databaseURL: "https://reactfirebase-d23fe.firebaseio.com",
    projectId: "reactfirebase-d23fe",
    storageBucket: "reactfirebase-d23fe.appspot.com",
    messagingSenderId: "806980862354"
});

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
