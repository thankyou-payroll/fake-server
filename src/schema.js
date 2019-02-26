import $ from "draxt";
import YAML from "yaml";
import faker from "faker";
import Chance from "chance";
import jsf from "json-schema-faker";

jsf.extend("faker", () => faker);
jsf.extend("chance", () => new Chance());

const parseYamlNode = async node => {
  const content = await node.read("utf8");
  return YAML.parse(content);
};

const parseYamlPath = async path => {
  const $nodes = await $(path);
  if ($nodes.files().length === 1) return await parseYamlNode($nodes.first());
  const nodes = {};
  await $nodes.mapAsync(async node => {
    nodes[node.name] = await parseYamlNode(node);
  });
  return nodes;
};

const getBlueprint = (name = "*") =>
  parseYamlPath(`${__dirname}/blueprints/${name}.yml`);

const getSchema = () => parseYamlPath(`${__dirname}/schema.yml`);

export { getBlueprint, getSchema };
