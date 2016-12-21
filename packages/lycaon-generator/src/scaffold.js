// Based on create-react-app
import chalk from 'chalk';
import deps from './packages';
import promisify from 'promisify-node';
const fs = promisify(require('fs-extra'));
import { execSync } from 'child_process';
import Handlebars from 'handlebars';
import path from 'path'
import spawn from 'cross-spawn';

const nodeVersion = process.versions.node;
if (nodeVersion.split('.')[0] < 4) {
    console.error(chalk.red(`You are using Node ${nodeVersion}, but lycaon requires Node 4 or higher.`));
    process.exit(1);
}

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

function copyStencil(options) {
    const templateRoot = path.join(__dirname, '..', 'template');

    return new Promise((resolve, reject) => {
        const promises = [];
        fs.walk(templateRoot)
            .on('data', ({ path: file, stats }) => {
                promises.push(transferFile(templateRoot, file, stats, options.root, options));
            })
            .on('end', () => {
                resolve(Promise.all(promises));
            });
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

function processError({ code, command, args }) {
    if (code !== 0) {
        console.error(`${chalk.cyan(command)} ${chalk.cyan(args.join(' '))} ${chalk.red('failed')}`);
        process.exit(1);
    }
}

export default async function scaffold(options) {
    if (! await isEmptyIsh(options.root)) {
        console.error(`The directory ${chalk.green(options.name)} contains conflicting files`);
        process.exit(1);
    }

    await writePackageJson(options);

    await copyStencil(options);

    await installPackages(deps.devDependencies, true, options.verbose).then(processError);
    await installPackages(deps.dependencies, false, options.verbose).then(processError);
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
