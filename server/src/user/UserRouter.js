const express = require("express");
const { save } = require("./UserService");
const { check, validationResult } = require("express-validator");
const ValidationException = require("../error/ValidationException");
const tr = require("../../locales/translation.json");

const router = express.Router();

/* User Registration */
router.post(
  "/api/1.0/users",
  check("firstName")
    .notEmpty()
    .withMessage(tr.firstName_null)
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage(tr.firstName_size),
  check("lastName")
    .notEmpty()
    .withMessage(tr.lastName_null)
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage(tr.lastName_size),
  check("email")
    .notEmpty()
    .withMessage(tr.email_null)
    .bail()
    .isEmail()
    .withMessage(tr.email_invalid),
  check("password")
    .notEmpty()
    .withMessage(tr.password_null)
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage(tr.password_size)
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage(tr.password_pattern),
  async (req, res, next) => {
    // Check for errors on the req fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }

    // Save user info to database
    await save(req.body);
    //   Send success message after user model successfully created
    res.send({ message: "User created" });
  }
);

module.exports = router;
