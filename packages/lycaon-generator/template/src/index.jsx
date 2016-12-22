// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import './index.css';
import App from './App';

const root = document.getElementById('app');

function renderApp() {
    ReactDOM.render(
        <AppContainer>
            <App />
        </AppContainer>,
        root,
    );
}

renderApp();

if (module.hot) {
    module.hot.accept('./App', () => {
        System.import('./App').then(renderApp);
    });
}
