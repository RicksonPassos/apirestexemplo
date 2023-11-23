const validarCamposTransacoes = async (req, res, next) => {
    const { descricao, categoria_id, tipo, data, valor } = req.body;
    
    if (!tipo || !descricao || !valor || !data || !categoria_id) {
        return res.status(400).json({ mensagem: 'Todos os campos obrigatórios devem ser informados.' })
    }

    if (tipo == 'entrada' || tipo == 'saida') {
        next();
    } else { return res.status(400).json({ mensagem: `O tipo deve corresponder corretamente a palavra de entrada ou saida` }) }; 
};

module.exports = {
    validarCamposTransacoes
};