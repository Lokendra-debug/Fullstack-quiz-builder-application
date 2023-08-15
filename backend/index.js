const express = require('express')
const cors = require('cors')
const { router } = require('./routes')
const { db } = require('./db')
const { User } = require('./models/user.model')
const app = express()
require('dotenv').config()

app.use(express.json())
app.use(cors())

app.use("/", router)

app.get('/home', async(req, res)=>{
    let users = await User.find()
    console.log(users)
    return res.status(200).send("Welcome to Quick Quiz...")
})


app.listen(process.env.port, async()=>{
    try {
        await db
        console.log('connect to database.')
        console.log("connected to server")
    } catch (ee) {
        console.log(ee)
    }
})