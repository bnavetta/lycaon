#!/usr/bin/env node
const command = process.argv[2];

switch (command) {
    case 'build':
        require('./build')();
        break;
    case 'start':
        require('./dev-server')();
        break;
    case 'dashboard':
        const spawn = require('cross-spawn');
        const path = require('path');
        spawn.sync(
            path.join(__dirname, 'node_modules', '.bin', 'webpack-dashboard'),
            ['--', path.join(__dirname, 'cli.js'), 'start'],
            { stdio: 'inherit' }
        );
        break;
    case 'test':
        require('./test')();
        break;
    default:
        console.log('Unknown command "' + command + '""');
        break;
}
