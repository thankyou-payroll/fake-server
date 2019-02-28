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
  log.params(params);
  switch (basePath) {
    case REST_API_PATH:
      jsonResponse(ctx, rest(params) || errorDefault(params));
      break;
    case MULTI_PART_PATH:
      multiPart(ctx);
      break;
    case WEB_SOCKET_PATH:
      jsonResponse(ctx, webSocket(params));
      break;
    default:
      jsonResponse(ctx, errorDefault(params));
  }
};
