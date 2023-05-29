const express = require("express");
const User = require("../model/User");
const crypto = require("crypto");
const AuthenticationException = require("./AuthenticationException");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const tr = require("../../locales/translation.json");

const router = express.Router();

const generateToken = (length) => {
  return crypto.randomBytes(length).toString("hex").substring(0, length);
};

router.post(
  "/api/1.0/auth",
  check("email").isEmail(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new AuthenticationException());
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return next(new AuthenticationException());
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return next(new AuthenticationException());
    }

    const token = generateToken(32);

    res.send({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
    });
  }
);

module.exports = router;
