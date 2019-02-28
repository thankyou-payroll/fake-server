import faker from "faker";
import Chance from "chance";
import jsf from "json-schema-faker";
import { rest, multiPart } from "./config";

jsf.extend("faker", () => faker);
jsf.extend("chance", () => new Chance());

const getRest = ({ path, method = "get", queryString, body }) =>
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

const getWebSocket = ({ event = "event", message = "Message" }) => ({
  event,
  message
});

export { getRest as rest, multiPart, getWebSocket as webSocket };
