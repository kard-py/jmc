import { clientes } from "../../../src/data";

export default (req, res) => {
  const { ["JMC.Auth.token"]: token } = req.cookies;
  const valid = false;
  if (valid) {
    const id_string = req.query.id;

    let id = parseInt(id_string);
    console.log(id);

    if (id < clientes.length) {
      res.status(200);
      res.json({ error: "null", cliente: clientes[id] });
    } else {
      res.status(404);
      res.json({ error: "id Inexistente" });
    }
  } else {
    res.json({ error: "Token De Sessão invalido" });
  }
};
