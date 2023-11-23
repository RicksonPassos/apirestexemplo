const { pool } = require("../database/dbConfig");

const listarTransacoes = async (req, res) => {

  try {
    const params = [req.usuario];
    const query = `select
    t.id as id,
    t.tipo,
    t.descricao,
    t.valor,
    t.data as data,
    t.usuario_id,
    t.categoria_id,
    c.descricao as categoria_nome
    from
    transacoes as t
    join categorias as c on t.categoria_id = c.id
    join usuarios as u on u.id = t.usuario_id
    where u.id = $1 order by t.id;`;

    const resposta = await pool.query(query, params);

    return res.status(200).json(resposta.rows);
    
  } catch (error) { res.status(500).json({ Mensagem: `Erro inesperdo do sistema.` }) };
};

const listarTransacaoId = async (req, res) => {
  const transacaoId = req.params.id;

  try {
    const params = [req.usuario, transacaoId];
    const query = `select
    t.id as id,
    t.tipo,
    t.descricao,
    t.valor,
    t.data as data,
    t.usuario_id,
    t.categoria_id,
    c.descricao as categoria_nome
    from
    transacoes as t
    join categorias as c on t.categoria_id = c.id
    join usuarios as u on u.id = t.usuario_id
    where u.id = $1 and t.id = $2;`;

    const resposta = await pool.query(query, params);

    if (resposta.rowCount < 1) {
      return res.status(404).json({ mensagem: `Transação não encontrada.` })
    }

    return res.status(200).json(resposta.rows[0]);
    
  } catch (error) { res.status(500).json({ Mensagem: `Erro inesperdo do sistema.` }) };
};

const cadastrarTransacao = async (req, res) => {
  const { tipo, descricao, valor, data, categoria_id } = req.body;

  const params = [tipo, descricao, valor, data, categoria_id, req.usuario]
  const query = `
    insert into transacoes
    (tipo, descricao, valor, data, categoria_id, usuario_id) 
    values ($1, $2, $3, $4, $5, $6)
    returning *,
      (select c.descricao as categoria_nome
      from categorias AS c
      where c.id = $5) as categoria_nome;
  `;

  try {
    const validarCategoria = await pool.query(`select * from categorias where id = $1`, [categoria_id]);

    if (validarCategoria.rowCount < 1) {
      return res.status(404).json({ mensagem: `Categoria não encontrada.` })
    }
    
    const retornoValores = await pool.query(query, params);

    return res.status(200).json(retornoValores.rows);

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do Servidor" })
  };

};


const atualizarTransacao = async (req, res) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const { id } = req.params;

  try {
    const { rowCount: categorias } = await pool.query(
      `select * from categorias where id = $1`,
      [categoria_id]
    );

    if (categorias === 0) {
      return res.status(404).json({ mensagem: 'Insira uma categoria válida.' })
    };

    const { rowCount } = await pool.query(
      "select * from transacoes where id = $1 and usuario_id = $2",
      [id, req.usuario]
    );

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: "Transação não encontrada." });
    };

    const params = [descricao, valor, data, categoria_id, tipo, id];
    const queryAtualizar = `
      update transacoes set
      (descricao, valor, data, categoria_id, tipo) = ($1,$2,$3,$4,$5) where id = $6
    `;

    await pool.query(queryAtualizar, params);

    return res.status(204).send();

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do Servidor" });
  };
};


const excluirTransacao = async (req, res) => {
  const { id } = req.params;
  
  try {
    const localizarTransacao = await pool.query(`select id from transacoes where id = $1 and usuario_id = $2`, [id, req.usuario])

    if (localizarTransacao.rowCount < 1) {
      res.status(400).json({ mensagem: `Transação não encontrada.` })
    };

    const query = `delete from transacoes where id = $1 and usuario_id = $2`;

    await pool.query(query, [id, req.usuario]);
    
    return res.status(200).send();

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do Servidor" });
  };

};

const extratoTransacao = async (req, res) => {
  let entradas = 0;
  let saidas = 0;

  const query = `select sum(valor), tipo from transacoes where usuario_id = $1 group by tipo`;

  try {
    const { rows } = await pool.query(query, [req.usuario]);

    for (const row of rows) {
      if (row.tipo === "entrada") {
        entradas += row.sum || 0;
      } else if (row.tipo === "saida") {
        saidas += row.sum || 0;
      }
    }

    return res.status(200).json({ entrada: Number(entradas), saida: Number(saidas)});

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do Servidor" });
  }
};


module.exports = {
  listarTransacoes,
  listarTransacaoId,
  cadastrarTransacao,
  atualizarTransacao,
  excluirTransacao,
  extratoTransacao, 
 
}