const { key,pool } = require("../database/dbConfig");
const jwt = require("jsonwebtoken");

const tokenAutentic = async (req, res, next) => {
  const { authorization } = req.headers;
  const bearerToken = authorization.split(` `)[1];
  const tokenAut = jwt.verify(bearerToken, key);

  try {

    if (!tokenAut) {
      return res.status(401).json({ menssagem: 'Não autorizado' })
    }

    const { id } = tokenAut
    req.usuario = id;
    next();

  } catch (error) { res.status(500).json({ Mensagem: `Erro inesperdo do sistema.` }), console.log(error.message); };
};

module.exports = { tokenAutentic };