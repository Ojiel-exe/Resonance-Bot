const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const chat = new Schema({
    _id: reqString,
    Channel: reqString,
})

module.exports = model('chat', chat)