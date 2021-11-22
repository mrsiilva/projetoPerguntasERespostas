//MODEL DE RESPOSTAS

const Sequelize = require("sequelize");
const connection = require("./database");//so coloca o nome database porque os arquivos estao na mesma pasta


const Resposta = connection.define("respostas", {
    corpoResposta: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    perguntaId: { //toda resposta vai responder uma pergunta, entao esse campo guarda o id da pergunta que essa resposta está respondendo
                 //ou seja estamos relacionando uma resposta a uma pergunta
        type: Sequelize.INTEGER, //tipo numero inteiro
        allowNull: false
    }
});

Resposta.sync({force: false})//esse comando vai sincronizar esse model acima com o banco de dados, ou seja
//vai criar essaa tabela acima no banco de dados

module.exports = Resposta;