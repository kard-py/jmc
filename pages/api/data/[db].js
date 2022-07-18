import connect from "../../../services/mongodb";

const Data = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const { db } = await connect();

  if (req.query.db === "clientes") {
    let clientes = await db.collection("clientes").find().toArray();
    return res.status(200).json(clientes);
  } else if (req.query.db === "produtos") {
    let produtos = await db.collection("produtos").find().toArray();
    return res.status(200).json(produtos);
  } else if (req.query.db === "servicos") {
    let servicos = await db.collection("servicos").find().toArray();
    return res.status(200).json(servicos);
  } else if (req.query.db === "users") {
    let users = await db.collection("users").find().toArray();
    return res.status(200).json(users);
  } else {
    return res.status(200).json({
      error: "adicione uma db valida no url da requisição",
      databases: ["clientes", "produtos", "servicos", "users"],
    });
  }

  return res
    .status(401)
    .json({ error: "LOGIN NÃO AUTORIZADO", token_jwt: "NOT_AUTH" });
};
export default Data;
