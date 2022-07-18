import jwt from "jsonwebtoken";
import connect from "../../../services/mongodb";

export default async (req, res) => {
  const data = {
    username: req.body.username,
    password: req.body.password,
  };

  const { db } = await connect();

  let users = await db.collection("users").find().toArray();

  for (let i in users) {
    if (
      users[i].username === data.username &&
      users[i].password === data.password
    ) {
      res.status(200).json({
        error: "null",
        token_jwt: jwt.sign(users[i].data, process.env.SECRET_KEY, {
          expiresIn: 60 * 45,
        }),
        userData: users[i].data,
      });
      res.end();
    }
  }
  res
    .status(401)
    .json({ error: "LOGIN NÃO AUTORIZADO", token_jwt: "NOT_AUTH" });

  res.end();
};
