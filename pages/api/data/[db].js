import jwt from "jsonwebtoken";
import connect from "../../../services/mongodb";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
  }

  const { db } = await connect();

  if (req.query.db === "clientes") {
    let clientes = await db.collection("clientes").find().toArray();
    res.status(200).json(clientes);
  } else if (req.query.db === "produtos") {
    let produtos = await db.collection("produtos").find().toArray();
    res.status(200).json(produtos);
  } else if (req.query.db === "servicos") {
    let servicos = await db.collection("servicos").find().toArray();
    res.status(200).json(servicos);
  } else if (req.query.db === "users") {
    let users = await db.collection("users").find().toArray();
    res.status(200).json(users);
  } else {
    res.status(200).json({
      error: "adicione uma db valida no url da requisição",
      databases: ["clientes", "produtos", "servicos", "users"],
    });
  }

  res
    .status(401)
    .json({ error: "LOGIN NÃO AUTORIZADO", token_jwt: "NOT_AUTH" });
};