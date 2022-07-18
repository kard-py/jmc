import connect from "../../../services/mongodb";

const Data = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
  }

  const { db } = await connect();

  let servicos = await db
    .collection("servicos")
    .find({ Categoria: "ASSISTÊNCIA TÉCNICA" })
    .toArray();
  return res.status(200).json(servicos);

  //   res
  //     .status(401)
  //     .json({ error: "LOGIN NÃO AUTORIZADO", token_jwt: "NOT_AUTH" });
};
export default Data;
