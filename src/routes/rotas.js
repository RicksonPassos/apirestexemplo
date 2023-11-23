
const express = require('express');
const { cadastroUsuarios, login, detalharPerfil, atualizarUsuario } = require('../controllers/usuarios');
const { emailCadastrado } = require('../middleware/emailCadastrado');
const { tokenAutentic } = require('../middleware/tokenAutentic');
const { listarCategorias } = require('../controllers/categorias');
const { validarCampos } = require('../middleware/validarCampos');
const { validarCamposTransacoes } = require('../middleware/validarCamposTransacao');
const { listarTransacoes, listarTransacaoId, excluirTransacao, extratoTransacao, cadastrarTransacao, atualizarTransacao } = require('../controllers/transacoes');

const rotas = express();

rotas.post(`/usuario`, emailCadastrado, validarCampos, cadastroUsuarios);
rotas.post(`/login`, login);
rotas.use(tokenAutentic);
rotas.get(`/transacao/extrato`, extratoTransacao);
rotas.get(`/usuario`,  detalharPerfil);
rotas.put(`/usuario`,   validarCampos, emailCadastrado, atualizarUsuario);
rotas.get(`/transacao`,  listarTransacoes);
rotas.get(`/categoria`,  listarCategorias);
rotas.get(`/transacao/:id`,  listarTransacaoId);
rotas.post(`/transacao`, validarCamposTransacoes, cadastrarTransacao);
rotas.put(`/transacao/:id`, validarCamposTransacoes, atualizarTransacao);
rotas.delete(`/transacao/:id`, excluirTransacao);

module.exports = {
    rotas
};