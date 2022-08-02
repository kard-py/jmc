import jwt from "jsonwebtoken";

const Login = async (req, res) => {
  res.status(200).json({
    msg: "Apenas PARA DEVS VOCÊ è UM Dev?",
  });
  res.end();
};

export default Login;
