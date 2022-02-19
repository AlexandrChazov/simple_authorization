const jwt = require("jsonwebtoken");
const { secretKey } = require("../config")

module.exports = function(req, res, next) {
  if (req.method === "OPTIONS") {
    next()                            // т.е. если метод запроса "OPTIONS", то мы ни чего не деламем, а вызываем следующий по цепочке middleware,
  }                                   // т.о. проверять будем только POST GET DELETE и т.д.

  try {
    const token = req.headers.authorization.split(" ")[1]  // убираем слово "Bearer " из токена
    if (!token) {
      res.status("404").json({ message: "User is not authorized" })
    }
    const decodedPayload = jwt.verify(token, secretKey);  // декодируем токен и получаем объект payload { id, roles }
    req.user = decodedPayload;                           // добавляем в запрос объект payload { id, roles }
    next()                                               // вызываем следующий по цепочке middleware
  } catch(e) {
    console.log(e)
    res.status("404").json({ message: "User is not authorized" })
  }
}

// токен имеет такой вид - "Bearer AFreDRGdfdsfsdf.SAFJfdgfg ..."
