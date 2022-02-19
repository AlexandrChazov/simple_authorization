const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, require: true, unique: true }, // для каждого пользователя MongoDB также автоматически создаст поле "id"
  password: { type: String, require: true },
  role: [{ type: String, ref: "Role"}]        // каждая роль у пользователя будет ссылаться на другую сущность - сущность роли
})

module.exports = model("User", userSchema)
