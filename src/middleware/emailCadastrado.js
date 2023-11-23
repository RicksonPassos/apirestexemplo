const { pool } = require("../database/dbConfig");

const emailCadastrado = async (req, res, next) => {
  const { email } = req.body;
  try {
    const params = [email];
    const query = 'select email from usuarios where email = $1';

    const resultado = await pool.query(query, params);

    if (resultado.rowCount > 0) {
      return res.status(409).json({ mensagem: `E-mail já registrado.` })

    } next();

  } catch (error) { res.status(500).json({ Mensagem: `Erro inesperdo do sistema.` }) };
};

module.exports = {
  emailCadastrado
};