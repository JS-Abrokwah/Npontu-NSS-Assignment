const request = require("supertest");
const app = require("../src/app");
const User = require("../src/model/User");
const sequelize = require("../src/config/database");
const tr = require("../locales/translation.json");
const bcrypt = require("bcrypt");

beforeAll(async () => {
  await sequelize.sync();
});

beforeEach(async () => {
  await User.destroy({ truncate: true });
});

activeUser = {
  firstName: "Joseph",
  lastName: "Abrokwah",
  email: "josephabrokwah32@gmail.com",
  password: "P4ssword",
};

const addUser = async (user = { ...activeUser }) => {
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  return await User.create(user);
};

const postAuthentication = async (credentials) => {
  return await request(app).post("/api/1.0/auth").send(credentials);
};

const postLogout = (options = {}) => {
  const agent = request(app).post("/api/1.0/logout");
  if (options.token) {
    agent.set("Authorization", `Bearer ${options.token}`);
  }
  return agent.send();
};

describe("Authentication", () => {
  it("returns 200 when credentials are correct", async () => {
    await addUser();
    const response = await postAuthentication({
      email: "josephabrokwah32@gmail.com",
      password: "P4ssword",
    });
    expect(response.status).toBe(200);
  });
  it("returns only user id, firstname, lastname and token when login success", async () => {
    const user = await addUser();
    const response = await postAuthentication({
      email: "josephabrokwah32@gmail.com",
      password: "P4ssword",
    });
    expect(response.body.id).toBe(user.id);
    expect(response.body.firstName).toBe(user.firstName);
    expect(response.body.lastName).toBe(user.lastName);
    expect(Object.keys(response.body)).toEqual([
      "id",
      "firstName",
      "lastName",
      "token",
    ]);
  });
  it("returns 401 when user does not exist", async () => {
    const response = await postAuthentication({
      email: "josephabrokwah32@gmail.com",
      password: "P4ssword",
    });

    expect(response.status).toBe(401);
  });
  it("returns proper error body when authentication fials", async () => {
    const nowInMillis = new Date().getTime();
    const response = await postAuthentication({
      email: "josephabrokwah32@gmail.com",
      password: "P4ssword",
    });

    expect(response.body.path).toBe("/api/1.0/auth");
    expect(response.body.timestamp).toBeGreaterThan(nowInMillis);
    expect(Object.keys(response.body)).toEqual([
      "path",
      "timestamp",
      "message",
    ]);
  });
  it("returns authentication failure message when authentication fails", async () => {
    const response = await postAuthentication({
      email: "josephabrokwah32@gmail.com",
      password: "P4ssword",
    });

    expect(response.body.message).toBe(tr.authentication_failure);
  });
  it("returns 401 when password is wrong", async () => {
    await addUser();
    const response = await postAuthentication({
      email: "josephabrokwah32@gmail.com",
      password: "Password",
    });

    expect(response.status).toBe(401);
  });
  it("returns 401 when email is not valid", async () => {
    const response = await postAuthentication({
      email: "josephabrokwah32gmail.com",
      password: "Password",
    });
  });
  it("returns 401 when password is not valid", async () => {
    await addUser();
    const response = await postAuthentication({
      email: "josephabrokwah32@gmail.com",
      password: "Password",
    });
  });
  it("returns token in response body when credentials are correct", async () => {
    await addUser();
    const response = await postAuthentication({
      email: "josephabrokwah32@gmail.com",
      password: "P4ssword",
    });

    expect(response.body.token).not.toBeUndefined();
  });
});
