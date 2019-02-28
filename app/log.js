/* eslint-disable no-console */
import chalk from 'chalk';
const { log } = console;

const divider = chalk.whiteBright('-- -- -- -- -- -- -- -- -- -- -- -- -- --');
const underline = chalk.gray('----------------------------');

const json = obj => JSON.stringify(obj, '', 2);

const params = ({ path, method, queryString, body }) =>
  log(chalk`
${chalk.blue.bold('Request:')} ${chalk.gray(path)}
${underline}
${chalk.green('Method:')} ${chalk.cyan(method.toUpperCase())}
${chalk.green('Path:')} ${chalk.cyan(path)}
${chalk.green('Query String:')} ${chalk.cyan(json(queryString))}
${chalk.green('Body:')} ${chalk.cyan(json(body))}
${divider}
  `);
const message = message =>
  log(chalk`
${chalk.whiteBright(message)}
${divider}
  `);

export default { params, message };
