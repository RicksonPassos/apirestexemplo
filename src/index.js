const express = require('express');
const { rotas } = require('./routes/rotas');
const app = express();
const port = 3000;

app.use(express.json());

app.use(rotas);

app.listen(port, () => {
  console.log(`Servidor Express rodando em http://localhost:${port}`);
});