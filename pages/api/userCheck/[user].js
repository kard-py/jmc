import connect from "../../../services/mongodb";

const Data = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const { db } = await connect();

  if (req.query.user) {
    let user = await db
      .collection("users")
      .findOne({ username: req.query.user });
    if (user) {
      return res
        .status(200)
        .json({ error: "Nome De usuario Já existe Faça o Login" });
    } else if (!user) {
      return res.status(200).json({ error: "null" });
    }
  }

  return res
    .status(401)
    .json({ error: "LOGIN NÃO AUTORIZADO", token_jwt: "NOT_AUTH" });
};
export default Data;
