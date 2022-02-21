const Router = require("express");
const authController = require("./auth.controller.js");
const { check } = require('express-validator');
const authMiddleware = require("./midleware/authMiddleware.js");
const roleMiddleware = require("./midleware/roleMiddleware.js")

const router = new Router();

router.post("/registration",
  check('username', "A username should not be empty").notEmpty(),
  check('password', "A password length should be more than 4 and less than 10 symbols").isLength({ min: 4, max: 10 }),
  authController.registration)
router.post("/login", authController.login )
router.get("/users", roleMiddleware(["ADMIN"]), authController.getUsers) // authMiddleware добавляет к реквесту поле "user": { id, roles }

module.exports = router;
