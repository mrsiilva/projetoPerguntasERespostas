//MODEL DE PERGUNTAS

const Sequelize = require("sequelize");
const connection = require("./database");//so coloca o nome database porque os arquivos estao na mesma pasta

//agora vamos definir o nosso model de tabela
const Pergunta = connection.define('perguntas',{//entre aspas o nome que vamos dar pra nossa tabela 
    titulo:{//definicao do primeiro campo, vou chamar de titulo
        type: Sequelize.STRING, //tipo do campo, nesse caso texto/string
        allowNull: false //impede que esse campo receba valores nulos
    },
    descricao:{//segundo campo, vou chamar de descricao
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Pergunta.sync({force:false}).then(() => {//esse comando vai sincronizar esse model acima com o banco de dados, ou seja
    //vai criar essaa tabela acima no banco de dados
    //e esse .then vai ser executado quando a tabela for criada
});

module.exports = Pergunta;