import { MongoClient } from "mongodb";

const URL =
  "mongodb+srv://Kard:caiodetz654321@cluster0.dpdcsag.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(URL);

export default async function connect() {
  await client.connect();

  const db = client.db("JMC");

  return { db, client };
}
