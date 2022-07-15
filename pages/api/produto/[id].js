import { produtos } from "../../../src/data";

export default (req, re) => {
  const id_string = req.query.id;

  let id = parseInt(id_string);

  console.log(id);

  if (id < produtos.length) {
    res.status(200);
    res.json({ error: "null", produto: produtos[id] });
  } else {
    res.status(404);
    res.json({ error: "id Inexistente" });
  }
};
