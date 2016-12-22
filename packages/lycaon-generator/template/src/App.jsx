import React from 'react';

export default class App extends React.Component {
    componentDidMount() {
        console.log('Component mounted');
    }

    render() {
        return (
            <h1>Hello, World!</h1>
        );
    }
}
