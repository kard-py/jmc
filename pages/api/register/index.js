import connect from "../../../services/mongodb";

const Login = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const data = {
    username: req.body.username,
    password: req.body.password,
    data: {
      name: req.body.name,
      email: req.body.email,
      avatar_url: "https://i.imgur.com/mrAq52P.png",
    },
  };

  const { db } = await connect();

  let userRes = await db.collection("users").insertOne(data);

  return res.status(200).json(userRes);
};

export default Login;
