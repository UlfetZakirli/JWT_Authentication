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
    const user = users.find((u) => u.username === username && u.password === password)
    if (user) {
        //Generate an access token
        const accessToken = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, 'mySecretKey')
        res.json({
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken
        })
    } else {
        res.status(400).json('Username or password incorrect!')
    }
})

const verify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1]; 
        jwt.verify(token, 'mySecretKey', (err, user) => {
            if (err) {
                return res.status(403).json('Token is not valid!')
            }
            req.user = user
            next()
        })
    } else {
        res.status(401).json('You are not authenticated!')
    }
}

app.delete("/api/users/:userId", verify, (req, res) => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
      res.status(200).json("User has been deleted.");
    } else {
      res.status(403).json("You are not allowed to delete this user!");
    }
  });

const PORT = 8000
app.listen(PORT, () => console.log(`Server running port: http://localhost:${PORT}`.blue.bold)) 