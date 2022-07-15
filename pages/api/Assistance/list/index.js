import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../../../src/data";

import connect from "../../../../services/mongodb";

export default async function Create(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
  }
  if (!req.body.token_jwt) {
    res.status(500).json({ error: "Not Auth" });
  }
  const token = req.body.token_jwt;
  const result = jwt.verify(token, SECRET_KEY, (err, decode) => {
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

    async function gen_id() {
      for (let i in response) {
        if (response[i]._id > i + 1 && i < response.length - 1) {
          let id = i + 1;
          console.log(id);
          return id;
          break;
        } else if (i === response.length - 1) {
          let id = response.length + 1;
          console.log(id);
          return id;
          break;
        }
      }
    }

    let id = await gen_id();

    console.log(id);

    res.status(200).json(response);
  } else {
    const error = result.error;
    res.status(405).json({ error: { error } });
  }
}
