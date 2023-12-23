const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  nom: String, // Last Name
  prenom: String, // First Name
  gender: String,
  phone: String, // Phone Number
  datenaissance: Date, // Date of Birth
  name: String, // For backward compatibility, you may choose to keep 'name' or use 'nom' and 'prenom' separately
  email: { type: String, unique: true },
  password: String,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
