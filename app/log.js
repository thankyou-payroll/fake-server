/* eslint-disable no-console */
import chalk from 'chalk';
const { log } = console;

const divider = chalk.whiteBright('-- -- -- -- -- -- -- -- -- -- -- -- -- --');
const underline = chalk.gray('----------------------------');

const json = obj => JSON.stringify(obj, '', 2);

const params = ({ type = 'Error', path, method, queryString, body, payload }) =>
  log(chalk`
${chalk.blue.bold('Request:')} ${chalk.gray(path)}
${underline}
${chalk.blue('Type:')} ${
    type === 'Error' ? chalk.redBright(type) : chalk.greenBright(type)
  }
${chalk.green('Method:')} ${chalk.cyan(method.toUpperCase())}
${chalk.green('Path:')} ${chalk.cyan(path)}
${chalk.green('Query String:')} ${chalk.cyan(json(queryString))}
${chalk.green('Body:')} ${chalk.cyan(json(body))}

${chalk.green('Payload:')} ${chalk.cyan(json(payload))}
${divider}
  `);
const info = message =>
  log(chalk`
${chalk.bgBlueBright(message)}
${divider}
  `);
const success = message =>
  log(chalk`
${chalk.bgGreen.black(message)}
${divider}
  `);
const error = message =>
  log(chalk`
${chalk.bgRedBright(message)}
${divider}
  `);

export default { params, info, success, error };
