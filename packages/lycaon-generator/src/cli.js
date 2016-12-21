import chalk from 'chalk';
import fs from 'fs-extra';

import { parse } from './options';
import scaffold from './scaffold';

const options = parse(process.argv);

if (!options) {
    process.exit(1);
}

fs.ensureDirSync(options.root);
process.chdir(options.root);

scaffold(options)
    .then(() => console.log(chalk.cyan('Done!')))
    .catch(e => {
        console.error(chalk.red(e));
        console.error(e.stack);
        process.exit(1);
    });
