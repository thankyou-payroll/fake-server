import qs from 'qs';
import { rest, webSocket, multiPart } from './faker';
import log from './log';

const {
  REST_API_PATH = '/api',
  MULTI_PART_PATH = '/upload',
  WEB_SOCKET_PATH = '/ws',
} = process.env;

const errorDefault = payload => ({ status: 404, payload });

const jsonResponse = (ctx, { status, payload }) => {
  ctx.status = status;
  ctx.body = payload;
};

const processRest = (ctx, params) => {
  const type = 'REST';
  const payload = rest(params) || errorDefault(params);
  jsonResponse(ctx, payload);
  log.params({ type, payload, ...params });
};
const processMultiPart = (ctx, params) => {
  const type = 'Multi Part';
  const payload = 'File';
  multiPart(ctx);
  log.params({ type, payload, ...params });
};
const processWebSocket = (ctx, params) => {
  const type = 'Web Socket';
  const payload = webSocket(params) || errorDefault(params);
  jsonResponse(ctx, payload);
  log.params({ type, payload, ...params });
};
const processErrorDefault = (ctx, params) => {
  const type = 'Error';
  const payload = errorDefault(params);
  jsonResponse(ctx, payload);
  log.params({ type, payload, ...params });
};

export default () => async ctx => {
  const { method, url, body } = ctx.request;
  const [path, queryString] = url.split('?');
  const [root, ...endpoint] = path.replace('/', '').split('/');
  const basePath = `/${root}`;
  const endpointPath = `/${endpoint.join('/')}`;
  const params = {
    path: endpointPath,
    method: method.toLowerCase(),
    queryString: qs.parse(queryString),
    body,
  };
  switch (basePath) {
    case REST_API_PATH:
      processRest(ctx, params);
      break;
    case MULTI_PART_PATH:
      processMultiPart(ctx, params);
      break;
    case WEB_SOCKET_PATH:
      processWebSocket(ctx, params);
      break;
    default:
      processErrorDefault(ctx, params);
  }
};
