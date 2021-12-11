const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

let penemu = new Schema({
    _id: reqString,
    User: reqString,
    Penemu: Object,
})

module.exports = model('penemu', penemu)