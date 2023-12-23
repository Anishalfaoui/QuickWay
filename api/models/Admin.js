const mongoose = require('mongoose')
const {Schema} = mongoose


const AdminSchema = new Schema({

        Nom: String,
        Prenom: String,
        Numtel: String,
        email: {type:String, unique:true},
        password: String,
      
})

const AdminModel = mongoose.model('Admin', AdminSchema);

module.exports = AdminModel;