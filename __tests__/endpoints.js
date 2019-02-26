import { generate } from "../helpers";
describe("Schema", () => {
  it("Generates POST /login payloads from schema", async () => {
    expect.assertions(2);
    const result = await generate.rest.post.success("/login");
    expect(result.user.email).toBeDefined();
    const errors = await generate.rest.post.error("/login");
    expect(errors.error.code).toBeGreaterThan(0);
  });
  it("Generates GET /users payloads from schema", async () => {
    expect.assertions(2);
    const result = await generate.rest.get.success("/users");
    expect(result.users.length).toBeGreaterThan(0);
    const errors = await generate.rest.get.error("/users");
    expect(errors.error.code).toBeGreaterThan(0);
  });
});
