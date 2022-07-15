import { MongoClient } from "mongodb";

const URL = process.env.URL_MONGO;

const client = new MongoClient(URL);

export default async function connect() {
  await client.connect();

  const db = client.db("JMC");

  return { db, client };
}
