const express = require("express")
const bodyParser = require("body-parser")
const connection = require('./database/database.js')
const Pergunta = require('./database/pergunta.js')
const Resposta = require('./database/resposta.js')
const app = express();

/* -----------------------------------------------------------------------------
                                Database
------------------------------------------------------------------------------*/


connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com o banco de dados!')
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })


/* -----------------------------------------------------------------------------
            Dizendo ao express para usar ejs como view engine
------------------------------------------------------------------------------*/


app.set('view engine', 'ejs');
app.use(express.static('public'));


/*------------------------------------------------------------------------------
                                Body Parser
------------------------------------------------------------------------------*/


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


/*------------------------------------------------------------------------------
                                    Rotas
------------------------------------------------------------------------------*/


app.get('/', (req, res) => {
    //findAll é equivalente à SELECT * ALL FROM pergunta
    Pergunta.findAll({ raw: true, order: [
        ['id','DESC'] //para crescente: ASC
    ]}).then(perguntas => {
        res.render('index', {
            perguntas: perguntas
        })
    })
});

app.get('/perguntar', (req, res) => {
    res.render("perguntar");
})

app.post('/salvarpergunta', (req, res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    
    //create é equivalente ao INSERT INTO perguntas ...Pergunta
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then (() => {
        res.redirect('/')
    })
})

app.get('/pergunta/:id', (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id} //quero procurar no BD uma pergunta de id definido igual ao id perguntado na rota
    }).then(pergunta => {
        if(pergunta != undefined) { //a pergunta foi encontrada
            
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                })
            });
        } else { //não encontrada
            res.redirect('/');
        }
    })
})

app.post('/responder', (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect('/pergunta/' + perguntaId)
    })

})

app.listen(8080, () => {
    console.log("App rodando!")
})


/* exemplo de uso abaixo:
    app.get("/:nome/:lang", (req,res) => {
    var nome = req.params.nome;
    var lang = req.params.lang; //vai ter que colocar no http o nome e linguagem após o localhost:8080
    var exibirMsg = true;

    var produtos = [
        {
            nome: 'Doritos',
            preco: 3.14
        },
        {
            nome: 'Coca-cola',
            preco: 5
        },
        {
            nome: 'Leite',
            preco: 1.45
        },
        {
            nome: 'Carne',
            preco: 15
        },
        {
            nome: 'Redbull',
            preco: 6
        },
        {
            nome: 'Nescau',
            preco: 4
        }
    ]
    res.render("index", {
        nome: nome,
        lang: lang,
        empresa: 'Guida do programador',
        inscritos: 8040,
        msg: exibirMsg,
        produtos: produtos
    }) //desenhar algo na tela
}); */
