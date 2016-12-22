#!/usr/bin/env node
const command = process.argv[2];

switch (command) {
    case 'build':
        require('./build')();
        break;
    case 'start':
        require('./dev-server')();
        break;
    default:
        console.log('Unknown command "' + command + '""');
        break;
}
