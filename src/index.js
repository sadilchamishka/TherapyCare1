import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import logo from './logo.png';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
  <div>
  <h1>TherapyCare</h1>
  <img className="img" src={logo} alt="Logo"/>
  </div>
  <App/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();