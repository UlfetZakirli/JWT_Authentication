const express = require('express')
const bodyParser = require('body-parser')
require('colors')
const jwt = require('jsonwebtoken')

let users = [
    {
        id: '1',
        username: 'ulfat',
        password: 'Ulfat2000',
        isAdmin: true
    },
    {
        id: '2',
        username: 'aynure',
        password: 'Aynure2001',
        isAdmin: false
    },
]

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/api/login', (req, res) => {
    const { username, password } = req.body
    const findUser = users.find((user) => user.username === username && user.password === password)
    if (findUser) {
        //Generate an access token
        const accessToken = jwt.sign({ id: findUser.id, isAdmin: findUser.isAdmin }, 'dontSayAnyone')
        res.json({
            username: findUser.username,
            isAdmin: findUser.isAdmin,
            accessToken
        })
    } else {
        res.status(400).json('Username or password incorrect!')
    }
})

const verify = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'dontSayAnyone', (err, user) => {
            if (err) {
                return res.status(403).json('Token is not valid!')
            }
            req.user = user
        })
    } else {
        res.status(401).json('You are not authenticated!')
    }
}

const PORT = 8000
app.listen(PORT, () => console.log(`Server running port: http://localhost:${PORT}`.blue.bold))