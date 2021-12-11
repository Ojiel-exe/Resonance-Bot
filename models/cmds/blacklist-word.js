const mongo = require('mongoose')

const Schema = new mongo.Schema({
    Guild: String,
    Words: Array
})
module.exports = mongo.model('blacklistword', Schema)
    // const reqString = {
    //     type: String,
    //     required: true
    // }

// const blacklistword = new Schema({
//     _id: reqString,
//     Words: Array,
// })

// module.exports = model('blacklistword', blacklistword)