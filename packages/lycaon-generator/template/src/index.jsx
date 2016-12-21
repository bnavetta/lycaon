// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import './index.css';

const root = document.getElementById('app');

function renderApp() {
    ReactDOM.render(
        <AppContainer>
            <h1>Hello, World!</h1>
        </AppContainer>,
        root
    );
}

renderApp();

if (module.hot) {
    module.hot.accept('./some-dep', () => {
        System.import('./some-dep').then(renderApp);
    });
}
