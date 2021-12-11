const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}


const caps = new Schema({
    _id: reqString,
    //Channel: reqString,
})

module.exports = model('caps', caps)