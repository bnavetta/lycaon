// Based on create-react-app

import chalk from 'chalk';

const nodeVersion = process.versions.node;
if (nodeVersion.split('.')[0] < 4) {
    console.error(chalk.red(`You are using Node ${nodeVersion}, but lycaon requires Node 4 or higher.`));
    process.exit(1);
}

import promisify from 'promisify-node';
const fs = promisify(require('fs-extra'));
import { execSync } from 'child_process';
import Handlebars from 'handlebars';
import path from 'path'
import spawn from 'cross-spawn';

function writePackageJson(options) {
    const packageJson = {
        name: options.name,
        version: '0.1.0',
        private: true
    };

    return fs.writeFile(path.join(options.root, 'package.json'), JSON.stringify(packageJson, null, 4));
}

async function transferFile(srcRoot, src, srcStats, destRoot, options) {
    const relativeSrc = path.relative(srcRoot, src);
    let dest = path.join(destRoot, relativeSrc);

    if (srcStats.isDirectory()) {
        if(options.verbose) {
            console.log(`Creating directory ${chalk.cyan(dest)}`);
        }

        return fs.ensureDir(dest);
    } else if (srcStats.isFile()) {
        if (path.extname(src) === '.hbs') {
            dest = dest.substring(0, dest.length - '.hbs'.length);

            if (options.verbose) {
                console.log(`Writing template ${chalk.cyan(relativeSrc)} to ${chalk.cyan(dest)}`);
            }

            const templateSource = await fs.readFile(src, 'utf8');
            const template = Handlebars.compile(templateSource);
            const context = { src: relativeSrc, srcRoot, dest, ...options };
            const output = template(context);
            return fs.writeFile(dest, output, 'utf8');
        } else {
            if (options.verbose) {
                console.log(`Writing file ${chalk.cyan(relativeSrc)} to ${chalk.cyan(dest)}`);
            }

            return fs.copy(src, dest);
        }
    }
}

function copyTemplate(options) {
    const templateRoot = path.join(__dirname, '..', 'template');
    fs.walk(templateRoot)
        .on('data', ({ path: file, stats }) => {
            transferFile(templateRoot, file, stats, options.root, options);
        });
}

function installPackages(packageSpecs, dev, verbose) {
    let args = ['add', ...packageSpecs];

    if (dev) {
        args.push('--dev');
    }

    if (verbose) {
        args.push('--verbose');
    }

    const child = spawn('yarn', args, { stdio: 'inherit' });
    return new Promise((resolve, reject) => {
        child.on('close', function (code) {
            resolve({ code, command: 'yarn', args });
        });
    });
}

export default async function scaffold(options) {
    if (! await isEmptyIsh(options.root)) {
        console.error(`The directory ${chalk.green(options.name)} contains conflicting files`);
        process.exit(1);
    }

    await writePackageJson(options);

    copyTemplate(options);

    // const { code, command, args } = await installPackages(['webpack@^2.2.0-rc.1'], true, options.verbose);
    // if (code !== 0) {
        // console.error(`${chalk.cyan(command + ' ' + args.join(' '))} failed`);
        // process.exit(1);
    // }
}

async function isEmptyIsh(root) {
    const files = await fs.readdir(root);
    return files.every(file => ['.DS_Store', 'Thumbs.db', '.git', '.gitignore'].indexOf(file) >= 0);
}

/*
Dev dependencies
webpack
eslint
eslint-plugin-jsx-a11y
eslint-plugin-import
eslint-plugin-react
*/
