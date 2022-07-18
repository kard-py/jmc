import jwt from "jsonwebtoken";

const RecoverUserInformation = (req, res) => {
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
    const userData = {
      name: result.payload.name,
      email: result.payload.email,
      avatar_url: result.payload.avatar_url,
    };
    const newToken = jwt.sign(userData, process.env.SECRET_KEY, {
      expiresIn: 60 * 45,
    });
    res.status(200).json({
      error: "null",
      token_jwt: newToken,
      userData: userData,
    });
  } else {
    res.status(200).json({ error: result.error, token_jwt: "NOT_AUTH" });
  }
};

export default RecoverUserInformation;
