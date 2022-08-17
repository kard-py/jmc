import jwt from "jsonwebtoken";
import connect from "../../../services/mongodb";

const Login = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const data = {
    username: req.body.username,
    password: req.body.password,
  };

  const { db } = await connect();

  let user = await db.collection("users").findOne(data);

  if (user !== null) {
    return res.status(200).json({
      error: "null",
      token_jwt: jwt.sign(user.data, process.env.SECRET_KEY, {
        expiresIn: 60 * 45,
      }),
      userData: user.data,
    });
  }

  return res
    .status(200)
    .json({ error: "Usuario ou senha Inesistente", token_jwt: "NOT_AUTH" });
};
export default Login;
