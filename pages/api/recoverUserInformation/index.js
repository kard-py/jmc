import jwt from "jsonwebtoken";

const RecoverUserInformation = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const result = jwt.verify(
    req.body.token_jwt,
    process.env.SECRET_KEY,
    (err, decode) => {
      if (err) {
        return res.status(200).json({ error: err, token_jwt: "NOT_AUTH" });
      }
      const userData = {
        name: decode.name,
        email: decode.email,
        avatar_url: decode.avatar_url,
      };
      const newToken = jwt.sign(userData, process.env.SECRET_KEY, {
        expiresIn: 60 * 45,
      });
      return res.status(200).json({
        error: "null",
        token_jwt: newToken,
        userData: userData,
      });
    }
  );
};

export default RecoverUserInformation;
