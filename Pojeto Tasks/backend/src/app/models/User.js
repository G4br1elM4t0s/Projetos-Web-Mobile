const mongoose = require("../../DataBase");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },

  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10); // segundo parâmetro significa o numero de rounds que o hash irá fazer ou sejá o numero de vezes que ele será gerado
  this.password = hash;
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
