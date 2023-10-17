"use strict";
const { pbkdf2Sync } = require("crypto");
const { sign, verify } = require("jsonwebtoken");
const buildResponse = require("./utils").buildResponse;
const { getUserByCredentials, saveResultsToDatabase } = require("./database");

let connectionInstance = null;

function extractBody(event) {
  if (!event?.body) buildResponse(422, { error: "Missing body" });

  return JSON.parse(event.body);
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

module.exports.login = async (event) => {
  const { username, password } = extractBody(event);
  const hashedPass = pbkdf2Sync(
    password,
    process.env.SALT,
    100000,
    64,
    "sha512"
  ).toString("hex");

  const user = await getUserByCredentials(username, hashedPass);

  if (!user) buildResponse(401, { error: "Invalid credentials" });

  const token = sign({ username, id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
    audience: "Serverless-nodejs",
  });

  return buildResponse(200, { token });
};

module.exports.sendResponse = async (event) => {
  const authResult = await authorize(event);

  if (authResult.statusCode === 401) return authResult;

  const { name, answers } = extractBody(event);
  const correctQuestions = [3, 1, 0, 2];

  const totalCorrectAnswers = answers.reduce((acc, answer, index) => {
    if (answer === correctQuestions[index]) {
      acc++;
    }
    return acc;
  }, 0);

  const result = {
    name,
    answers,
    totalCorrectAnswers,
    totalAnswers: answers.length,
  };

  const insertedId = await saveResultsToDatabase(result);

  return buildResponse(201, {
    resultId: insertedId,
    __hypermedia: {
      href: `/results.html`,
      query: { id: insertedId },
    },
  });
};

module.exports.getResult = async (event) => {
  const authResult = await authorize(event);
  if (authResult.statusCode === 401) return authResult;

  const result = await getResultsById(event.pathParameters.id);

  if (!result) buildResponse(404, { error: "Result not found" });

  return buildResponse(200, result);
};
