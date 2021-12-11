const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}


const ads = new Schema({
    _id: reqString,
    //Channel: reqString,
})

module.exports = model('ads', ads)