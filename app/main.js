import Koa from "koa";
import bodyParser from "koa-body";
import cors from "@koa/cors";
import router from "./router";

const { PORT = 3000 } = process.env;

const app = new Koa();

export default new Promise(resolve => {
  app
    .use(bodyParser())
    .use(router())
    .use(cors())
    .listen(PORT, () => {
      console.log(`Server started on port ${PORT}`); // eslint-disable-line
      resolve(PORT);
    });
});
