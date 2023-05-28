const bcrypt = require("bcrypt");
const User = require("../model/User");

const save = async (body) => {
  // Destructure all user info required
  const { firstName, lastName, email, password } = body;
  // Create a hash of the password to be saved in the database
  hash_password = await bcrypt.hash(password, 10);

  // Create a serialized version of the user
  const user = { firstName, lastName, email, password: hash_password };
  // Save user to database
  await User.create(user);
};

module.exports = { save };
