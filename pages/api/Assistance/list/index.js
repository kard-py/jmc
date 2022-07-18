import jwt from "jsonwebtoken";

import connect from "../../../../services/mongodb";

export default async function Create(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
  }
  if (!req.body.token_jwt) {
    res.status(500).json({ error: "Not Auth" });
  }
  const token = req.body.token_jwt;
  const result = jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
    if (err) {
      return { isValid: false, payload: null, error: err };
    }
    return { isValid: true, payload: decode };
  });

  if (result.isValid) {
    const data = req.body;
    delete data.token_jwt;

    const { db } = await connect();

    const response = await db.collection("assistances").find().toArray();

    res.status(200).json(response);
  } else {
    const error = result.error;
    res.status(405).json({ error: { error } });
  }
}
