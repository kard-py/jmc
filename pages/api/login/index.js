import { users, SECRET_KEY } from "../../../src/data";

import jwt from "jsonwebtoken";

export default (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
  }

  const data = {
    username: req.body.username,
    password: req.body.password,
  };

  for (let i in users) {
    if (
      users[i].username === data.username &&
      users[i].password === data.password
    ) {
      res.status(200).json({
        error: "null",
        token_jwt: jwt.sign(users[i].data, SECRET_KEY, { expiresIn: 60 * 45 }),
        userData: users[i].data,
      });
    }
  }
  res
    .status(401)
    .json({ error: "LOGIN NÃO AUTORIZADO", token_jwt: "NOT_AUTH" });
};
