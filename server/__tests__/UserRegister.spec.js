const request = require("supertest");
const app = require("../src/app");
const User = require("../src/model/User");
const sequelize = require("../src/config/database");
const tr = require("../locales/translation.json");

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

const postUser = async (user = validUser) => {
  return await request(app).post("/api/1.0/users").send(user);
};

describe("User Registration", () => {
  /* Success Cases */
  it("returns 200 when register success", async () => {
    const response = await postUser();
    expect(response.status).toBe(200);
  });
  it("returns User created when register success", async () => {
    const response = await postUser();
    expect(response.body.message).toBe(tr.user_create_success);
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

  /* Fail Cases */
  it.each`
    field          | value              | message
    ${"firstName"} | ${null}            | ${tr.firstName_null}
    ${"firstName"} | ${"usr"}           | ${tr.firstName_size}
    ${"firstName"} | ${"a".repeat(33)}  | ${tr.firstName_size}
    ${"lastName"}  | ${null}            | ${tr.lastName_null}
    ${"lastName"}  | ${"usr"}           | ${tr.lastName_size}
    ${"lastName"}  | ${"a".repeat(33)}  | ${tr.lastName_size}
    ${"email"}     | ${null}            | ${tr.email_null}
    ${"email"}     | ${"mail.com"}      | ${tr.email_invalid}
    ${"email"}     | ${"user.mail.com"} | ${tr.email_invalid}
    ${"email"}     | ${"user@mail"}     | ${tr.email_invalid}
    ${"password"}  | ${null}            | ${tr.password_null}
    ${"password"}  | ${"usr"}           | ${tr.password_size}
    ${"password"}  | ${"a".repeat(33)}  | ${tr.password_size}
    ${"password"}  | ${"alllowercase"}  | ${tr.password_pattern}
    ${"password"}  | ${"ALLUPPERCASE"}  | ${tr.password_pattern}
    ${"password"}  | ${"1234567890"}    | ${tr.password_pattern}
    ${"password"}  | ${"lowerandUPPER"} | ${tr.password_pattern}
    ${"password"}  | ${"lower4nd5667"}  | ${tr.password_pattern}
    ${"password"}  | ${"UPPER44444"}    | ${tr.password_pattern}
  `(
    "returns $message when $field is $value",
    async ({ field, value, message }) => {
      user = { ...validUser };
      user[field] = value;
      const response = await postUser(user);
      expect(response.body.validationErrors[field]).toBe(message);
    }
  );
});

describe("Error Model", () => {
  it("returns path, timestamp, message and validationErrors in response when validation failure", async () => {
    const response = await postUser({ ...validUser, firstName: null });
    expect(Object.keys(response.body)).toEqual([
      "path",
      "timestamp",
      "message",
      "validationErrors",
    ]);
  });
  it("returns path in error body", async () => {
    const response = await postUser({ ...validUser, firstName: null });
    expect(response.body.path).toEqual("/api/1.0/users");
  });
  it("returns timestamp in milliseconds within 5 seconds in error body", async () => {
    const nowInMillis = new Date().getTime();
    const FiveSecondsLater = nowInMillis + 5 * 1000;
    const response = await postUser({ ...validUser, firstName: null });
    expect(response.body.timestamp).toBeGreaterThan(nowInMillis);
    expect(response.body.timestamp).toBeLessThan(FiveSecondsLater);
  });
});
