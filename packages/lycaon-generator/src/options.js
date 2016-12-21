import path from 'path';

import program from 'commander';
import chalk from 'chalk';

export function parse(argv) {
    program
        .usage(chalk.green('<project directory>') + ' [options]')
        .arguments('<project directory>')
        .option('--verbose', 'log more detailed messages')
        .parse(argv);

    const name = program.args[0];

    const options = {
        name,
        verbose: Boolean(program.verbose),
        root: path.resolve(name),
    };

    if (typeof options.name === 'undefined') {
        console.error('Please specify the project directory:');
        console.log(`    ${chalk.cyan(program.name())} ${chalk.green('<project directory>')}`);
        return false;
    }

    return options;
}
