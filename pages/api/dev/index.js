import jwt from "jsonwebtoken";

const Login = async (req, res) => {
  res.status(200).json({
    error: "null",
    token_jwt: jwt.sign(
      { erro: "dá errro Agora filha da puta" },
      process.env.SECRET_KEY,
      {
        expiresIn: 60 * 45,
      }
    ),
    userData: {},
  });
  res.end();
};

export default Login;
