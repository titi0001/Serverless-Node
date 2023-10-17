"use strict";
const { buildResponse } = require("./utils");
const { getUserByCredentials, saveResultsToDatabase, getResultsById } = require("./database");
const { makeHash, authorize, createToken } = require("./auth");

let connectionInstance = null;

function extractBody(event) {
  if (!event?.body) buildResponse(422, { error: "Missing body" });

  return JSON.parse(event.body);
}

module.exports.login = async (event) => {
  const { username, password } = extractBody(event);
  const hashedPass = makeHash(password);

  const user = await getUserByCredentials(username, hashedPass);
  if (!user) buildResponse(401, { error: "Invalid credentials" });

  return buildResponse(200, { token: createToken(username, user._id) });
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
