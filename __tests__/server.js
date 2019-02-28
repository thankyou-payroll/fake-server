import axios from "axios";
import server from "../app/main";

const req = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 1000
});

describe("Server", async () => {
  it("Connect", async () => {
    expect.assertions(1);
    const port = await server;
    expect(port).toBe(3000);
  });

  it("POST /api/login", async () => {
    expect.assertions(2);
    const res = await req.post("/api/login", {
      email: "test@test.com",
      password: "my-password"
    });
    const { data } = res;
    expect(data.user.email).toBeDefined();
    try {
      await req.post("/api/login", { email: "bad@email.com" });
    } catch ({ response }) {
      expect(response.status).toBe(401);
    }
  });
  it("GET /api/users", async () => {
    expect.assertions(2);
    const {
      data: { users }
    } = await req.get("/api/users?token=my-secret");
    expect(users.length).toBeGreaterThan(0);
    try {
      await req.get("/api/users");
    } catch ({ response }) {
      expect(response.status).toBe(401);
    }
  });
});
