const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const birthdays = new Schema({
  //  Guild : reqString,
   User : reqString,
   Birthday : reqString
})

module.exports = model('birthday', birthdays)