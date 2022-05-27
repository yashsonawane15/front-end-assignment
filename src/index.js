import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'typeface-roboto';
import registerServiceWorker from './registerServiceWorker';
import Controller from './screens/Controller';
import store from './store';
import { Provider } from 'react-redux';

ReactDOM.render(
        <Controller />
        , document.getElementById('root')
);

registerServiceWorker();
