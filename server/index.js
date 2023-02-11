const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
require('colors')

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
    }
]

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


let refreshTokens = []

app.post('/api/refresh', (req, res) => {
    const refreshToken = req.body.token
    if (!refreshToken) {
        return res.status(401).json('You are not authenticated!')
    }
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json('Refresh token is invalid!')
    }
    jwt.verify(refreshToken, 'myRefreshSecretKey', (err, user) => {
        err && console.log(err);
        refreshTokens = refreshTokens.filter(token => token !== refreshToken)
        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)
        refreshTokens.push(newRefreshToken)
        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
    })

})


const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        'mySecretKey',
        { expiresIn: '1m' }
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
    const currentUser = users.find((user) => username === user.username && password === user.password)
    //Generate an access token
    const accessToken = generateAccessToken(currentUser)
    const refreshToken = generateRefreshToken(currentUser)
    refreshTokens.push(refreshToken)

    if (currentUser) {
        res.json({
            username: currentUser.username,
            isAdmin: currentUser.isAdmin,
            accessToken,
            refreshToken
        })
    } else {
        res.status(400).json('Username or password invalid!')
    }
})

const verify = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'mySecretKey', (err, user) => {
            if (err) {
                return res.status(403).json('Token is invalid!')
            }
            req.user = user
            next()
        })
    } else {
        res.status(401).json('You are not authenticated!')
    }
}

app.delete('/api/users/:userId', verify, (req, res) => {
    const { userId } = req.params
    if (req.user.id === userId || req.user.isAdmin) {
        res.status(200).json('User has been deleted!')
    } else {
        res.status(403).json('You are not allowed to delete this user!')
    }

})

app.post('/api/logout', verify, (req, res) => {
    const refreshToken = req.body.token
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
    res.status(200).json('You logged out successfully!')

})



const PORT = 8000
app.listen(PORT, () => console.log(`Server running port: http://localhost:${PORT}`.blue.bold))
