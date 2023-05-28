const request = require("supertest");
const app = require("../src/app");
const User = require("../src/model/User");
const sequelize = require("../src/config/database");

beforeAll(async () => {
  await sequelize.sync();
});

beforeEach(async () => {
  await User.destroy({ truncate: true });
});

validUser = {
  firstName: "Joseph",
  lastName: "Abrokwah",
  email: "josephabrokwah32@gmail.com",
  password: "P4ssword",
};

const postUser = async (user = { ...validUser }) => {
  return await request(app).post("/api/1.0/users").send(user);
};

describe("User Registration", () => {
  it("returns 200 when register success", async () => {
    const response = await postUser();
    expect(response.status).toBe(200);
  });
  it("returns User created when register success", async () => {
    const response = await postUser();
    expect(response.body.message).toBe("User created");
  });
  it("saves user to database", async () => {
    await postUser();
    const users = await User.findAll();
    expect(users.length).toBe(1);
  });
  it("saves user firstName, lastName, & Email to database", async () => {
    await postUser();
    const users = await User.findAll();
    expect(users[0].firstName).toBe("Joseph");
    expect(users[0].lastName).toBe("Abrokwah");
    expect(users[0].email).toBe("josephabrokwah32@gmail.com");
  });
  it("encrypts password into database", async () => {
    await postUser();
    const users = await User.findAll();
    expect(users[0].password).not.toBe("P4ssword");
  });
});
