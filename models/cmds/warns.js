const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

let warns = new Schema({
    Guild: reqString,
    user: String,
    content: Array
})

module.exports = model('warns', warns)