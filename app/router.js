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

const tryRest = (ctx, params) => {
  const [e] = rest.filter(
    ({ method = 'get', path }) =>
      method.toUpperCase() === params.method.toUpperCase() &&
      path === params.path,
  );
  if (e) {
    const type = 'REST';
    const payload = generatePayload({ ...e, ...params });
    jsonResponse(ctx, payload);
    log.params({ type, payload, ...params });
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
