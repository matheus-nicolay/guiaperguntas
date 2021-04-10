//iniciando express
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//conexão com o banco
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta")

//dizendo para o express usar ejs
app.set('view engine', 'ejs');
app.use(express.static('public'));

//iniciando body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


connection
    .authenticate()
    .then(() => {
        console.log("Conexão efetuada com sucesso")
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })

//rotas 
app.get("/", (req, res) => {
    Pergunta.findAll({raw: true, order:[
        ['id','DESC'] //ASC = crescente
    ]}).then(perguntas =>{
        res.render("index", {
            perguntas: perguntas
        });
    });
});
app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});


app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var pergunta = req.body.pergunta;
    Pergunta.create({
        titulo: titulo,
        descricao: pergunta
    }).then(() =>{
        res.redirect("/");
    });
});

app.post("/salvarresposta", (req, res) => {
    var corpo = req.body.corpo;
    var pergunta = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        pergunta: pergunta
    }).then(() =>{
        res.redirect("/pergunta/"+pergunta);
    });
});

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta =>{
        if(pergunta != undefined){
            Resposta.findAll({
                where: {id: pergunta.id},
                order:[
                    ['id','DESC']
                ]
            }).then(respostas =>{
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        }else{
            res.redirect("/");
        }
    });   
});

//mensagem para validar inicio do localhost
app.listen(80, ()=>{
    console.log("Sistema rodando");
});