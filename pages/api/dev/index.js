import jwt from "jsonwebtoken";

const Dev = async (req, res) => {
  res.status(200).json({
    msg: "Apenas PARA DEVS VOCÊ è UM Dev?",
  });
  res.end();
};

export default Dev;
