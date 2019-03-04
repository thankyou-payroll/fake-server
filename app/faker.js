import faker from 'faker';
import Chance from 'chance';
import jsf from 'json-schema-faker';
import { rest, multiPart, webSocket } from './config';

jsf.extend('faker', () => faker);
jsf.extend('chance', () => new Chance());

const getRest = ({ path, method = 'get', queryString, body }) =>
  rest
    .filter(e => e.method === method && e.path === path)
    .map(e => {
      if (!e.validate || e.validate({ queryString, body })) {
        const { httpCode = 200, ...payload } = e.success;
        return { status: httpCode, payload: jsf.generate(payload) };
      } else {
        const { httpCode = 500, ...payload } = e.error;
        return { status: httpCode, payload: jsf.generate(payload) };
      }
    })[0];

const getWebSocket = ({ event, params }) =>
  webSocket
    .filter(w => w.event === event)
    .map(w => {
      if (!w.validate || w.validate({ params })) {
        return jsf.generate(w.success);
      } else {
        return jsf.generate(w.error);
      }
    })[0];

const getMultiPart = ({ path }) => multiPart.filter(m => m.path === path)[0];

export {
  getRest as rest,
  getMultiPart as multiPart,
  getWebSocket as webSocket,
};
