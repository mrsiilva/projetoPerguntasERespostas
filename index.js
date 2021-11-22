const express = require("express");//importando modulo express
const app = express(); //criando copia do express e colocando dentro da variavel app
//atraves dessa variavel app agora, eu consigo criar rotas pra minha apliacacao
//e etc
const bodyParser = require("body-parser");
const conexao = require("./database/database");//importa o arquivo com a conexao sequelize
const modelPergunta = require("./database/Pergunta"); //importa o model Pergunta
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

//Database Testando conexão
conexao
    .authenticate()//vai tentar se conectar com o mysql
    .then(() => {//se a autenticação ocorrer com sucesso executa a funcao then
        console.log("Conexão feita com o banco de dados")
    })
    .catch((msgErro) => {//mas caso um erro aconteça, executa a funcao catch
        console.log(msgErro);
    }) 


//ESTOU DIZENDO PARA O EXPRESS USAR O EJS COMO VIEW ENGINE, OU SEJA, O QUE EU
//QUERO USAR DE RENDERIZADOR DO HTML, NESSE CASO "EJS".
app.set('view engine', 'ejs');

//AQUI EU DEFINO QUE QUERO USAR ARQUIVOS ESTATICOS, E ENTRE PARENTESES O NOME DA PASTA
//Que quero guardar esses arquivos, nesse caso, eu chamei de public(padrão)
app.use(express.static('public'));

//BodyParser
app.use(bodyParser.urlencoded({extended: false}));//DECODIFICA OS DADOS ENIVADOS PELO FORMULARIO
app.use(bodyParser.json());//permite ler dados de formularios, enviados via json


//ROTAS
//ROTA PAGINA PRINCIPAL//essa é a primeira rota que voce faz
app.get("/", (req, res) => {
    Pergunta.findAll({raw:true, order: [//RAW SIGNIFICA CRUA, OU SEJA ELE VAI TRAZER APENAS OS DADOS PERGUNTA E DESCRICAO, NADA MAIS
        ['id','DESC']//ORDER:[] aqui vai ordenar as perguntas, por id(tambem poderia ser por titulo, descricao,data) e na ordem decrescente. ou seja, do mais recente para o mais antigo
    ]}).then(perguntas => {
        res.render("index", {
            perguntas: perguntas//ou seja, estou criando uma variavel perguntas, que recebe as perguntas que vem do banco de dados
        });//comando para exibir o html, quando o usuario acessar essa rota
        //index é o nome do arquivo. index.ejs responsavel pela visualizacao da pagina principal
    }); //o metodo FindAll é responsavel por procurar todas as perguntas da tabela e retornar pra gente
    //é a mesma coisa que SELECT * ALL FROM perguntas. E o then vai receber essa lista de perguntas que vão ser salvas nessa variavel perguntas da funcao
    
});

//ROTA PAGINA PARA PERGUNTAR
app.get("/perguntar", (req, res) => {
    res.render("perguntas");
});

//recebe dados que o usuario digitar no formulario, nessa rota
app.post("/salvarpergunta", (req, res) => {
    let titulo = req.body.titulo; //assim pego as infromacoes do formulario, esse .titulo, está ligado ao name definido no form html do arquivo perguntas.ejs
    let descricao = req.body.descricao;//eles so funcionam com bodyparser
    Pergunta.create({//O CREATE É RESPONSAVEL POR SALVAR ESSA PERGUNTA NO BANCO DE DADOS
        //ou seja, se eu quero salvar algum dado dentro de uma tabela, eu tenho que pegar o model dessa tabela, e atraves
        //desse model eu tenho que chamar o metodo create, ele é equivalente a escrever (INSERT INTO perguntas etc etc)
        titulo: titulo, //passo os dados que vem no formulario e atribuo a variavel que criei acima pra eles
        descricao: descricao//mesma coisa
    }).then(() => {//caso a pergunta seja enviada com sucesso
        res.redirect("/");// redireciono o usuario para a pagina principal "/"
    });
});

//rota para cada vez que eu clicar em responder uma pergunta, eu seja redirecionada para a pagina dela
app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id; 
    Pergunta.findOne({//metodo do sequelize que vai buscar pra gente no banco de dados 1 dado, e eu quero 1 dado com uma condição
        where: {id: id}//ou seja, eu quero buscar no meu banco de dados uma pergunta com a condicao que ela tanha o id igual a minha variavel id
        //outro exemplo: where: {titulo: "Como fritar um ovo?"}
    }).then(pergunta => {//quando a operacao de busca for concluida ele vai chamar esse then e passar a pergunta nessa variavel pra gente
            if(pergunta != undefined){//se pergunta for diferente de undefined, significa que ela foi achada
                
                Resposta.findAll({//ou seja, eu quero achar todas as respostas que tenham o perguntaId igual ao pergunta.id da pagina
                    where: {perguntaId: pergunta.id},
                    order:[['id', 'DESC']]
                }).then(respostas => {
                    res.render("pergunta", {
                        pergunta: pergunta,//passa a pergunta pra view(pagina da pergunta no caso)
                        respostas: respostas//e passa todas as respostas dessa pergunta tambem para a pagina dessa pergunta.
                    });//quando achar a pergunta exibe a pagina "pergunta.ejs"(no singular)
                });
            } else{//mas se ele nao conseguir encontrar uma pergunta que tenha o id igual o id da pergunta que eu passei no meu parametro, a pergunta vai ser nula, ou seja, nao foi encontrada
                res.redirect("/");//nao achou, redireciona pra pagina principal
            }
    });
});


app.post("/responder", (req, res) => {
    let corpo = req.body.corpoResposta
    let perguntaId = req.body.pergunta;

    Resposta.create({
        corpoResposta: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId);//depois que responder sera redirecionado para a pagina da pergunta que foi respondida
    });
});

//RODANDO NOSSA APLICACAO//sempre que criar sua primeira rota, teste 
//ela rodando a aplicacao, ou seja, é a segunda coisa a ser criada
app.listen(8080, ()=>{
    console.log("App rodando");
});
