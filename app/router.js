import qs from 'qs';
import { rest, multiPart } from './faker';
import log from './log';

const { REST_API_PATH = '/api', MULTI_PART_PATH = '/upload' } = process.env;

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
  const uploader = multiPart(params);
  uploader.upload(ctx);
  log.params({ type, ...params });
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
  const params = {
    method: method.toLowerCase(),
    queryString: qs.parse(queryString),
    body,
  };
  if (path.startsWith(MULTI_PART_PATH))
    processMultiPart(ctx, {
      path: path.replace(MULTI_PART_PATH, ''),
      ...params,
    });
  else if (path.startsWith(REST_API_PATH))
    processRest(ctx, { path: path.replace(REST_API_PATH, ''), ...params });
  else processErrorDefault(ctx, params);
};
