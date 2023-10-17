const { MongoClient, ObjectId } = require("mongodb");

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

async function getUserByCredentials(username, password) {
  const client = await connectToDatabase();
  const collection = client.collection("users");
  const user = collection.findOne({ username, password });

  if (!user) return null;
  return user;
}

async function saveResultsToDatabase(result) {
  const client = await connectToDatabase();
  const collection = client.collection("results");
  const { insertedId } = await collection.insertOne(result);
  return insertedId;
}

async function getResultsById(id) {
  const client = await connectToDatabase();
  const collection = client.collection("results");

  const result = await collection.findOne({ _id: new ObjectId(id) });
  if (!result) return null;
  return result;
}

module.exports = {
  getUserByCredentials,
  connectToDatabase,
  saveResultsToDatabase,
  getResultsById,
};
