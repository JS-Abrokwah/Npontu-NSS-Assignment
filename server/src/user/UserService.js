const bcrypt = require("bcrypt");
const User = require("../model/User");

const save = async (body) => {
  const { firstName, lastName, email, password } = body;
  hash_password = await bcrypt.hash(password, 10);

  const user = { firstName, lastName, email, password: hash_password };
  await User.create(user);
};

module.exports = { save };
