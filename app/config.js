import isEqual from 'lodash/isEqual';
import { parse } from 'yaml';
import { readFileSync } from 'fs';
import multer from 'koa-multer';

const upload = multer({ storage: multer.memoryStorage() });

const getYaml = fileName => {
  const content = readFileSync(
    `${__dirname}/../responses/${fileName}.yml`,
    'utf8',
  );
  return parse(content);
};

const getRest = ({ path, method = 'get', validate, success, error }) => ({
  path,
  method,
  validate: ({ queryString, body }) =>
    (!validate.queryString || isEqual(validate.queryString, queryString)) &&
    (!validate.body || isEqual(validate.body, body)),
  success: success && getYaml(success),
  error: error && getYaml(error),
});
const getMultiPart = ({ path, fields }) => ({
  path,
  upload: upload.fields(fields),
});
const getWebSocket = ({ event, message }) => ({ event, message });

const getConfig = () => {
  const { rest = [], multiPart = [], webSocket = [] } = getYaml('config');
  return {
    rest: rest.map(getRest),
    multiPart: multiPart.map(getMultiPart),
    webSocket: webSocket.map(getWebSocket),
  };
};
const { rest, multiPart, webSocket } = getConfig();

export { rest, multiPart, webSocket };
