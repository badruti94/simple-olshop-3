const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()
const login = require('./routes/login')
const user = require('./routes/user')
const admin = require('./routes/admin')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/login',login)
app.use('/user', user)
app.use('/admin', admin)

const port =  process.env.PORT || 3001
app.listen(port, ()=>{
    console.log(`Listening on http://localhost:${port}`);
})