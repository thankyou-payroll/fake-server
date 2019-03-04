import faker from 'faker';
import Chance from 'chance';
import jsf from 'json-schema-faker';

jsf.extend('faker', () => faker);
jsf.extend('chance', () => new Chance());

const generatePayload = ({
  validate,
  queryString,
  body,
  success = {},
  error = {},
}) => {
  if (!validate || validate({ queryString, body })) {
    const { httpCode = 200, ...payload } = success;
    return { status: httpCode, payload: jsf.generate(payload) };
  } else {
    const { httpCode = 500, ...payload } = error;
    return { status: httpCode, payload: jsf.generate(payload) };
  }
};

export { generatePayload };
