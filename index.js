const express = require("express");
const authRouter = require("./authRouter.js");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json())
app.use("/auth", authRouter)

const start = async () => {
  try {
    await mongoose.connect("mongodb://qwerty:qwerty123@cluster0-shard-00-00.84vuy.mongodb.net:27017,cluster0-shard-00-01.84vuy.mongodb.net:27017,cluster0-shard-00-02.84vuy.mongodb.net:27017/simple_authorization?ssl=true&replicaSet=atlas-12ueio-shard-0&authSource=admin&retryWrites=true&w=majority")
    app.listen(PORT, () => {
      console.log(`Server is working on PORT ${PORT}`)
    })
  } catch(e) {
    console.log(e)
  }
}

start()

