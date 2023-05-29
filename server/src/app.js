const express = require("express");
const UserRouter = require("./user/UserRouter");
const AuthenticationRouter = require("./auth/AuthenticationRouter");
const ErrorHanlder = require("./error/ErrorHandler");

const app = express();

// Middleware
app.use(express.json());
// Middleware with user routes
app.use(UserRouter);
app.use(AuthenticationRouter);

// Error Handler Middleware for handling any errors
app.use(ErrorHanlder);

module.exports = app;
