const { pool, key } = require("../database/dbConfig");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const cadastroUsuarios = async (req, res) => {
  const { nome, email, senha } = req.body;
  const senhaHash = await bcrypt.hash(senha, 10);
  const params = [nome, email, senhaHash];

  const query = `insert into usuarios (nome, email, senha) 
  values ($1, $2, $3) 
  returning id, nome, email`;
  
  try {
    
    const retornoConsulta = await pool.query(query, params);

    const dados = retornoConsulta.rows[0];

    return res.status(201).json(dados)

  } catch (error) { res.status(500).json({ Mensagem: `Erro inesperdo do sistema.` }) };
};

const login = async (req, res) => {
  const { email, senha } = req.body;
  const params = [email];
  const query = `select * from usuarios where email = $1;`;
  
  try {

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Campos de Email ou senha não preenchidos' })
    };

    const usuario = await pool.query(query, params);

    if (usuario.rowCount < 1) {
      return res.status(401).json({ mensagem: `E-mail ou senha inválidos.` });
    };

    const senhaVerifi = await bcrypt.compare(senha, usuario.rows[0].senha);

    if (!senhaVerifi) {
      return res.status(401).json({ mensagem: `E-mail ou senha inválidos.` });
    };

    const token = jwt.sign({ id: usuario.rows[0].id }, key, { expiresIn: `1h` });


    return res.status(200).json({ usuario: usuario.rows[0], token });
    
  } catch (error) {
    res.status(500).json({ Mensagem: `Erro inesperdo do sistema.` })
  };
};

const detalharPerfil = async (req, res) => {

  try {
    const params = [req.usuario];
    const query = `select * from usuarios where id = $1;`;

    const { rows } = await pool.query(query, params);

    const { senha, ...usuarioSemSenha } = rows[0];

    return res.status(200).json(usuarioSemSenha);
    
  } catch (error) {
    res.status(500).json({ Mensagem: `Erro inesperdo do sistema.` })
  };
};

const atualizarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  const senhaHash = await bcrypt.hash(senha, 10);

  try {
    const query = `update usuarios set nome = $1, email = $2, senha = $3 where id = $4`;
    const params = [nome, email, senhaHash, req.usuario];

    await pool.query(query, params);

    return res.status(204).json();

  } catch (error) {
    res.status(500).json({ Mensagem: `Erro inesperdo do sistema.` });
  };
};

module.exports = {
  cadastroUsuarios,
  login,
  detalharPerfil,
  atualizarUsuario
};