import React from 'react';

import styles from './App.css';

export default class App extends React.Component {
    componentDidMount() {
        console.log('Component mounted');
    }

    render() {
        return (
            <h1 className={styles.app}>Hello, World!</h1>
        );
    }
}
