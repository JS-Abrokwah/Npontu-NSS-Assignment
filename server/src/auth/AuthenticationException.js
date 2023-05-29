const tr = require("../../locales/translation.json");
module.exports = function AuthenticationException() {
  this.status = 401;
  this.message = tr.authentication_failure;
};
