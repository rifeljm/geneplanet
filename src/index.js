import '@babel/polyfill';
import ReactDOM from 'react-dom';
import React from 'react';
import { Router } from '@reach/router';

import App from './components/App.js';

window.app = window.app || {};

ReactDOM.render(
  <Router>
    <App path="/" />
  </Router>,
  document.getElementById('main')
);
