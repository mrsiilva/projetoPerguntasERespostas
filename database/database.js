//AQUI DENTRO FICA A NOSSA CONEXÃO COM O SEQUELIZE

const Sequelize = require("sequelize"); //importa o modulo sequelize

//construção da nossa conexao
const connection = new Sequelize('guiaperguntas', 'root', 'muitos27que', {
    host: 'localhost', //o servidor onde está rodando seu mysql(nesse caso aqui está rodando na minha maquina)
    dialect: 'mysql' //qual tipo de banco de dados que queremos nos conectar
}); //Entre parenteses o nome do banco de dados que voce criou lá no mysql
//o usuario do banco de dados(por padrao:root), e a senha


//Exporta a conexao que criamos, para usarmos em outros arquivos
module.exports = connection;