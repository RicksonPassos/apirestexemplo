const { pool } = require("../database/dbConfig");

const listarCategorias = async (req, res) => {
  const query = `select * from categorias;`;

  try {
    const resposta = await pool.query(query);

    return res.status(200).json(resposta.rows);
    
  } catch (error) {
    res.status(500).json({ Mensagem: `Erro inesperdo do sistema.` })
  };
};

module.exports = {
  listarCategorias
}