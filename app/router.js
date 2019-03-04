import pipe from 'lodash/flow';
import qs from 'qs';
import { rest, multiPart } from './endpoints';
import { generatePayload } from './faker';
import log from './log';

const { API_PATH = '/api' } = process.env;

const errorDefault = payload => ({ status: 404, payload });

const jsonResponse = (ctx, { status, payload }) => {
  ctx.status = status;
  ctx.body = payload;
};

const tryMultiPart = (ctx, params) => {
  const [e] = multiPart.filter(m => m.path === params.path);
  if (e) {
    const type = 'Multi Part';
    e.upload(ctx);
    log.params({ type, ...params });
    return true;
  }
};

const tryRest = (ctx, { path, method = 'get', queryString, body }) => {
  const [e] = rest.filter(
    e => e.method === method.toLowerCase() && e.path === path,
  );
  if (e) {
    const type = 'REST';
    const payload = generatePayload({ ...e, path, method, queryString, body });
    jsonResponse(ctx, payload);
    log.params({ type, payload, path, method, queryString, body });
    return true;
  }
};

const showError = (ctx, params) => {
  const type = 'Error';
  const payload = errorDefault(params);
  jsonResponse(ctx, payload);
  log.params({ type, payload, ...params });
};

export default () => async ctx => {
  const { method, url, body } = ctx.request;
  const [path, queryString] = url.split('?');
  const params = {
    method,
    path: path.replace(API_PATH, ''),
    queryString: qs.parse(queryString),
    body,
  };
  if (path.startsWith(API_PATH)) {
    pipe(
      () => tryMultiPart(ctx, params),
      b => b || tryRest(ctx, params),
      b => b || showError(ctx, params),
    )();
  } else showError(ctx, params);
};
