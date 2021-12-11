const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}


const antiscam = new Schema({
    _id: reqString,
    //Channel: reqString,
})

module.exports = model('antiscam', antiscam)