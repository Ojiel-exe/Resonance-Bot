const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

let mutesystem = new Schema({
      _id : reqString,
      Users : Array
})

module.exports = model('mutesystem', mutesystem)