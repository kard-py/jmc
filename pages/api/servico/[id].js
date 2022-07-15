import { servicos } from "../../../src/data";

export default (req, res) => {
  const id_string = req.query.id;

  let id = parseInt(id_string);

  if (id < servicos.length) {
    res.status(200);
    res.json({ error: "null", servico: servicos[id] });
  } else {
    res.status(404);
    res.json({ error: "id Inexistente" });
  }
};
