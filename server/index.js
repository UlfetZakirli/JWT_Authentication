const express = require('express')
require('colors')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

let users = [
    {
        id: '1',
        username: "ulfat",
        password: 'Ulfat2000',
        isAdmin: true
    },
    {
        id: '2',
        username: "aynure",
        password: 'Aynure2001',
        isAdmin: false
    }
]

let refreshTokens = []

const generateAccessToken = (user) => {
    return (
        jwt.sign(
            { id: user.id, isAdmin: user.isAdmin },
            'secretKey',
            { expiresIn: '5s' }
        )
    )
}

const generateRefreshToken = (user) => {
    return (
        jwt.sign(
            { id: user.id, isAdmin: user.isAdmin },
            'refreshSecretKey'
        )
    )
}

app.post('/api/refresh', (req, res) => {
    const refreshToken = req.body.token
    if (!refreshToken) {
        return res.status(401).json('You are not authenticated!')
    }
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json('Refreshtoken is invalid!')
    }
    jwt.verify(refreshToken, 'refreshSecretKey', (err, user) => {
        err && console.log(err);
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)
        refreshTokens.push(newRefreshToken)

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
    })
})

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
            isAdmin: user.isAdmin,
            accessToken,
            refreshToken
        })
    }
    else {
        res.status(400).json('Username or password invalid!')
    }
})

const verify = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretKey', (err, user) => {
            if (err) {
                res.status(403).json('Token is invalid!')
            }
            req.user = user
            console.log('req.user1', req.user);
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
    res.status(200).json('User logged out successfully!')
})


const PORT = 8000
app.listen(PORT, () => console.log(`Server running port: http://localhost:${PORT}`.blue.bold))
