import faker from "faker";
import Chance from "chance";
import jsf from "json-schema-faker";
import { getSchema, getBlueprint } from "./schema";

jsf.extend("faker", () => faker);
jsf.extend("chance", () => new Chance());

const generateData = async name => {
  const blueprint = await getBlueprint(name);
  return jsf.resolve(blueprint);
};

const generateRestPayload = type => (restMethod = "get") => async endpoint => {
  const { rest } = await getSchema();
  const [generatedEndpoint] = await Promise.all(
    rest
      .filter(
        ({ path, method = "get" }) =>
          path === endpoint && method.toLowerCase() === restMethod
      )
      .map(props => generateData(props[type]))
  );
  return generatedEndpoint;
};

const generateSuccess = generateRestPayload("success");
const generateError = generateRestPayload("error");

const generatePayloads = (method = "get") => ({
  success: generateSuccess(method),
  error: generateError(method)
});

const rest = {
  get: generatePayloads("get"),
  post: generatePayloads("post"),
  delete: generatePayloads("delete"),
  put: generatePayloads("put"),
  patch: generatePayloads("patch")
};
// TODO: Implement MultiPart upload, subscription and GraphQL support
// const multiPart = {};
// const graphql = {};
// const subscription = {};

export { rest };
