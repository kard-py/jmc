const SECRET_KEY = process.env.SECRET_KEY;

import connect from "../../../../services/mongodb";

const { db } = await connect();

let clientes = await db.collection("clientes").find().toArray();
let produtos = await db.collection("produtos").find().toArray();
let servicos = await db.collection("servicos").find().toArray();
let users = await db.collection("users").find().toArray();

export { clientes, produtos, servicos, users, SECRET_KEY };
