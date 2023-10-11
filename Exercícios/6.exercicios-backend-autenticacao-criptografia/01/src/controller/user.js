const pool = require('../connection/connection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passwordJwt = require('../passwordJwt')

const registerUser = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Fill in the required fields' })
    }

    try {
        const encryptedPassword = await bcrypt.hash(password, 10)

        const newUser = await pool.query(
            'insert into users (name, email, password) values ($1, $2, $3) returning *',
            [name, email, encryptedPassword]
        )

        return res.status(201).json(newUser.rows[0])

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Fill in the required fields' })
    }

    try {
        const user = await pool.query(
            'select * from users where email = $1',
            [email]
        )

        if (user.rowCount < 1) {
            return res.status(404).json({ message: 'Email or password invalid' })
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password)

        if (!validPassword) {
            return res.status(400).json({ message: 'Email or password invalid' })
        }

        const token = jwt.sign({ id: user.rows[0].id }, passwordJwt, { expiresIn: '8h' })

        const { password: _, ...userLogged } = user.rows[0]

        return res.json({ user: userLogged, token })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const getProfile = async (req, res) => {
    return res.json(req.user)
}

module.exports = {
    registerUser,
    login,
    getProfile
}