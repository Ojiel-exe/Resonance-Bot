const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}


const altdetect = new Schema({
    _id: reqString,
    Avatar: reqString,
    Days: Number,
})

module.exports = model('altdetect', altdetect)