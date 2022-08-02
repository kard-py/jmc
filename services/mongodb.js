import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let cachedClient;
let cachedDb;

export default async function connect() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  await client.connect();

  const db = client.db("JMC");

  cachedClient = client;
  cachedDb = db;

  return { db, client };
}
