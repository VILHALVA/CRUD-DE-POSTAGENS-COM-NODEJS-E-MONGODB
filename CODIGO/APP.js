const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const Post = require('./models/Post');

// Configuração do Handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}));
app.set('view engine', 'handlebars');

// Configuração do Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexão com o MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/postapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Rota para exibir a lista de posts
app.get('/', function(req, res) {
  Post.find().sort({ _id: -1 })
    .then(posts => {
      res.render('home', { posts: posts });
    })
    .catch(err => {
      res.send('Erro ao recuperar posts');
    });
});

app.get('/cad', function(req, res){
  res.render("FORMULARIO");
});

// Rota para processar o formulário
app.post('/cad', function(req, res){
  const newPost = new Post({
    titulo: req.body.titulo,
    conteudo: req.body.conteudo
  });
  newPost.save()
    .then(() => {
      res.redirect('/');
    })
    .catch((erro) => {
      res.send("OCORREU UM ERRO: " + erro);
    });
});

// Rota para excluir postagem
app.get('/deletar/:id', function(req, res) {
  const postId = req.params.id;

  Post.findByIdAndDelete(postId)
    .then(() => {
      res.send("POSTAGEM DELETADA COM SUCESSO!");
    })
    .catch((erro) => {
      res.send("OCORREU UM ERRO: " + erro);
    });
});

app.get('/edit/:id', function(req, res){
  Post.findById(req.params.id)
    .then(post => {
      res.render('form-edit', {
        id: req.params.id,
        titulo: post.titulo,
        conteudo: post.conteudo
      })
    })
    .catch(err => {
      res.send('POST NÃO ENCONTRADO!')
    })
});

app.post('/editado/:id', function(req, res){
  Post.findByIdAndUpdate(req.params.id, {
    titulo: req.body.titulo,
    conteudo: req.body.conteudo
  })
  .then(() => {
    res.redirect('/')
  })
  .catch(err => {
    console.log(err);
    res.send('Erro ao editar post');
  });
});

// Inicie o servidor
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
