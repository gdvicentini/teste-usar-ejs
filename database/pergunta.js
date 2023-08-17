const Sequelize = require('sequelize')
const connection = require('./database.js')

const Pergunta = connection.define('perguntas', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false //evita campo nulo
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Pergunta.sync({force: false}).then (() => {})

module.exports = Pergunta