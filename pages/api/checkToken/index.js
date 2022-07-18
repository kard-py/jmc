import jwt from "jsonwebtoken";

const CheckToken = (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
  }

  jwt.verify(req.body.token_jwt, process.env.SECRET_KEY, (err, decode) => {
    if (err) {
      return res.status(200).json({ error: "Token Invalido", status: false });
    }
    return res.status(200).json({ error: "null", status: true });
  });
};

export default CheckToken;
