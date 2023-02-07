const express = require('express')
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
        password: 'Aynure2000',
        isAdmin: false
    }
]

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/api/users', (req, res) => res.json(users))


let refreshTokens = []

app.post('/api/refersh', (req, res) => {
    const refershToken = req.body.token
    if (!refershToken) return res.status(401).json('You are not authenticated!')
    if (!refreshTokens.includes(refershToken)) {
        return res.status(403).json('Refresh token is not valid')
    }
    jwt.verify(refershToken, "myRefreshSecretKey", (err, user) => {
        err && console.log(err);
        refreshTokens.filter(token => token !== refershToken)

        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)

        refreshTokens.push(newRefreshToken)

        res.status(200).json({
            accessToken: newAccessToken,
            refershToken: newRefreshToken
        })
    })

})

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        'mySecretKey',
        { expiresIn: '20s' }
    )
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        'myRefreshSecretKey'
    )
}

app.post('/api/login', (req, res) => {
    const { username, password } = req.body
    const user = users.find((user) => user.username === username && user.password === password)
    if (user) {
        //Generate an access token
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        refreshTokens.push(refreshToken)

        res.json({
            username: user.username,
            password: user.password,
            accessToken,
            refreshToken

        })
    } else {
        res.status(400).json('Username or password incorrect!')
    }
})

const verify = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(" ")[1]
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

app.delete('/api/users/:userId', verify, (req, res) => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
        res.status(200).json('User has been deleted!')
    } else {
        res.status(403).json('You are not allowed to delete this user!')
    }
})

const PORT = 7000
app.listen(PORT, () => console.log(`Server running port: http://localhost:${PORT}`.blue.bold))
