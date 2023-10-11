const jwt = require('jsonwebtoken')
const passwordJwt = require('../passwordJwt')
const pool = require('../connection/connection')

const verifyLoggedInUser = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authorization.split(' ')[1]

    try {
        const { id } = jwt.verify(token, passwordJwt)

        const { rowCount, rows } = await pool.query('select * from users where id = $1', [id])

        if (rowCount < 1) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        req.user = rows[0]

        next()

    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
}

module.exports = verifyLoggedInUser