const mongoose = require('mongoose');

// Definindo o schema do documento
const postSchema = new mongoose.Schema({
    titulo: String,
    conteudo: String
});

// Definindo o modelo usando o schema
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
