const jwt = require("jsonwebtoken");
const { secretKey } = require("../config")

module.exports = (roles) => {
  return function(req, res, next) {
    if (req.method === "OPTIONS") {
      next()                            // т.е. если метод запроса "OPTIONS", то мы ни чего не деламем, а вызываем следующий по цепочке middleware,
    }                                   // т.о. проверять будем только POST GET DELETE и т.д.

    try {
      const token = req.headers.authorization.split(" ")[1]  // убираем слово "Bearer " из токена
      if (!token) {
        res.status("404").json({ message: "User is not authorized" })
      }
      const { roles: userRoles } = jwt.verify(token, secretKey);    // декодируем токен и получаем объект payload { id, roles }
      let isAdmin = false;                                          // после чего забираем поле roles
      userRoles.forEach(role => {
        if (roles.includes(role)) {
          isAdmin = true;
        }
      })
      if (!isAdmin) {
        res.status(403).json({ message: "Not enought rights" })
      }
      next()                                               // вызываем следующий по цепочке middleware
    } catch (e) {
      console.log(e)
      res.status("404").json({ message: "User is not authorized" })
    }
  }
}

// токен имеет такой вид - "Bearer AFreDRGdfdsfsdf.SAFJfdgfg ..."
