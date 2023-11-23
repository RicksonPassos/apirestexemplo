const validarCampos = async (req, res, next) => {
    const { nome, email, senha } = req.body

    if (!nome) {
        return res.status(400).json({ mensagem: 'O campo nome deve ser preenchido' })
    }
    if (!email) {
        return res.status(400).json({ mensagem: 'O campo email deve ser preenchido' })
    }
    if (!senha) {
        return res.status(400).json({ mensagem: 'O campo senha deve ser preenchido' })
    }
    next();
};

module.exports = {
    validarCampos
};