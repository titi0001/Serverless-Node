const { pbkdf2Sync } = require("crypto");
const { sign, verify } = require("jsonwebtoken");
const { buildResponse } = require("./utils");

function createToken(username, id) {
  const token = sign({ username, id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
    audience: "Serverless-nodejs",
  });

  return token;
}

function makeHash(password) {
  return pbkdf2Sync(password, process.env.SALT, 100000, 64, "sha512").toString(
    "hex"
  );
}

async function authorize(event) {
  const { authorization } = event.headers;

  if (!authorization)
    buildResponse(401, { error: "Missing authorization header" });

  const [type, token] = authorization.split(" ");
  if (type != "Bearer" || !token)
    buildResponse(401, { error: "Invalid authorization scheme" });

  const decoded = verify(token, process.env.JWT_SECRET, {
    audience: "Serverless-nodejs",
  });
  if (!decoded) buildResponse(401, { error: "Invalid token" });

  return decoded;
}

module.exports = {
  createToken,
  makeHash,
  authorize,
};
