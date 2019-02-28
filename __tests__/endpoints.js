import { rest } from "../app/faker";

describe("Schema", async () => {
  it("Generates POST /login payloads from schema", async () => {
    expect.assertions(4);
    const success = rest({
      method: "post",
      path: "/login",
      body: { email: "test@test.com", password: "my-password" }
    });
    expect(success.status).toBe(200);
    expect(success.payload.user.email).toBeDefined();
    const error = rest({
      method: "post",
      path: "/login",
      body: { email: "bad@email.com" }
    });
    expect(error.status).toBe(401);
    expect(error.payload.error.code).toBe(401);
  });
  it("Generates GET /users payloads from schema", async () => {
    expect.assertions(4);
    const success = rest({
      path: "/users",
      queryString: { token: "my-secret" }
    });
    expect(success.status).toBe(200);
    expect(success.payload.users.length).toBeGreaterThan(0);
    const error = rest({ path: "/users" });
    expect(error.status).toBe(401);
    expect(error.payload.error.code).toBe(401);
  });
});
