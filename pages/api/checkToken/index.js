import jwt from "jsonwebtoken";

export default (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
  }

  const result = jwt.verify(
    req.body.token_jwt,
    process.env.SECRET_KEY,
    (err, decode) => {
      if (err) {
        return { isValid: false, payload: null, error: err };
      }
      return { isValid: true, payload: decode };
    }
  );

  if (result.isValid === true) {
    res.status(200).json({ error: "null", status: true });
  } else {
    res.status(200).json({ error: "Token Invalido", status: false });
  }
  res.status(200).json({ error: "null", status: true });
};
