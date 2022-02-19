const Role = require("./models/Role.js");
const User = require("./models/User.js");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { secretKey } = require("./config.js");

const generateAccessToken = (id, roles) => {
  const payload = {                            // информация, которая будет зашифрована в jwt-токене
    id,                                        //  какие данные шифровать мы решаем сами
    roles
  }
  return jwt.sign(payload, secretKey, { expiresIn: "24h" }) // сформировать jwt-токен
}

class AuthController {

  async registration(req, res) {
    try {
      // const user = new Role()                         этот костыль добавляет две роли в БД - User и Admin один раз добавили и забыли
      // const admin = new Role({ value: "ADMIN" })
      // await user.save()
      // await admin.save()
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Registration error occurred", errors })
      }

      const { username, password } = req.body;
      const candidate = await User.findOne({ username })  // ищем в БД пользователя с таким именем

      if (candidate) {
        return res.status("400").json({ message: "A user with this name already exists" })
      }

      const hashedPassword = bcrypt.hashSync( password, 7 );   /* вторая цифра это степень хэширования, чем она больше тем сложнее будет
                                                                  расхэшировать пароль, но и времени на хэширование понадобится больше   */
      const userRole = await Role.findOne({ value: "USER" })
      const user = new User({ username, password: hashedPassword, role: [userRole.value] })
      await user.save();
      return res.json({ message: "User registered" })
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: "Registration error" })
    }
  }

  async login(req, res) {
    try {
      // const user = new Role()
      // await user.save()
      // await Role.deleteOne({ value: "User"})
      const { username, password } = req.body;
      const user = await User.findOne({ username })

      if (!user) {
        return res.status(400).json({ message: `User ${username} not found` })
      }

      const isValidPassword = bcrypt.compareSync(password, user.password);  // сравнение введённого пароля с захэшированным

      if (!isValidPassword) {
        return res.status(400).json({ message: "Wrong password" })
      }
      const token = generateAccessToken(user._id, user.role)
      return res.json({ token })
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: "Login error" })
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find()
      return res.json(users)
    } catch (e) {
      console.log(e)
    }
  }

}

module.exports = new AuthController()
