'use strict'
const { pbkdf2Sync } = require('crypto');
const { sign, verify } = require('jsonwebtoken');
const { MongoClient, ObjectId } = require("mongodb");

let connectionInstance = null;

async function connectToDatabase() {
  if (connectionInstance) return connectionInstance;
  const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const connection = await client.connect();
  connectionInstance = connection.db(process.env.MONGODB_DB_NAME);
  return connectionInstance;
}

function extractBody(event) {
  if (!event?.body) {
    return {
      statusCode: 422,
      body: JSON.stringify({ error: "Missing body" }),
    };
  }

  return JSON.parse(event.body);
}

async function authorize(event) {
  const { authorization } = event.headers;
 
  if(!authorization){
    return{
      statusCode: 401,
      body: JSON.stringify({ error: "Missing authorization header" }),
    };
  }

  const [type, token] = authorization.split(' ');
  if (type != 'Bearer' || !token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Invalid authorization scheme" }),
    };
  }

  const decoded = verify(token, process.env.JWT_SECRET, { audience: 'Serverless-nodejs' });
  if (!decoded) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Invalid token" }),
    };
  }
  return decoded
}


module.exports.login = async ( event ) => {
  const { username, password } = extractBody(event); 
  const hashedPass = pbkdf2Sync(password, process.env.SALT, 100000, 64, 'sha512').toString('hex');

  const client = await connectToDatabase();
  const collection = client.collection("users");
  const user = await collection.findOne({ name: username, password: hashedPass });

  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Invalid credentials" }),
    };
  }

  const token = sign( { username, id: user._id }, process.env.JWT_SECRET, { 
    expiresIn: '24h', 
    audience: 'Serverless-nodejs'
  })
  
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  }
 
};

module.exports.sendResponse = async (event) => {
  const authResult = await authorize(event);

  if (authResult.statusCode === 401)  return authResult;
  
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

  const client = await connectToDatabase();
  const collection = client.collection("results");
  const { insertedId } = await collection.insertOne(result);

  return {
    statusCode: 201,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resultId: insertedId,
      __hypermedia: {
        href: `/results.html`,
        query: { id: insertedId },
      },
    }),
  };
};

module.exports.getResult = async (event) => {
  const authResult = await authorize(event);
  if (authResult.statusCode === 401)  return authResult;

  const client = await connectToDatabase();
  const collection = await client.collection("results");

  const result = await collection.findOne({
    _id: new ObjectId(event.pathParameters.id),
  });

  if (!result) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Result not found" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  };
};
