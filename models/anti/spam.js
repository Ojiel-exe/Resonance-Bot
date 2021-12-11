const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}


const spam = new Schema({
    _id: reqString,
    //Channel: reqString,
})

module.exports = model('spam', spam)