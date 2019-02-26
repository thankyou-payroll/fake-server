import Koa from "koa";
import Router from "koa-router";
import { rest } from "./faker";

const app = new Koa();
const router = new Router();

// response
router.all("/api/:endpoint", async ctx => {
  const { method } = ctx.req;
  const { endpoint } = ctx.params;
  const m = method.toLowerCase();
  ctx.body = await rest[m].success(`/${endpoint}`);
});
app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000);
