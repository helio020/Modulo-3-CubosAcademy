const pool = require('../connection/connection')
const jwt = require('jsonwebtoken')
const passwordJwt = require('../passwordJwt')

const registerPokemon = async (req, res) => {
    const { name, nickname, skills, image } = req.body
    const { authorization } = req.headers

    const token = authorization.split(' ')[1]

    if (!name || !nickname || !skills || !image) {
        return res.status(400).json({ message: 'Fill in the required fields' })
    }

    try {
        const { id } = jwt.verify(token, passwordJwt)

        const newPokemon = await pool.query(
            'insert into pokemons (user_id, name, skills, image, nickname) values ($1, $2, $3, $4, $5) returning *',
            [id, name, skills, image, nickname]
        )

        return res.status(201).json(newPokemon.rows[0])

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const updatePokemon = async (req, res) => {
    const { id } = req.params
    const { nickname } = req.body

    if (!nickname) {
        return res.status(400).json({ message: 'Fill in the required field' })
    }

    try {
        const { rowCount } = await pool.query(
            'select * from pokemons where id = $1',
            [id]
        )

        if (rowCount < 1) {
            return res.status(404).json({ message: 'Pokemon not found' })
        }

        const { rows } = await pool.query(
            'update pokemons set nickname = $1 where id = $2 returning *',
            [nickname, id]
        )

        return res.status(200).json(rows[0])

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const getPokemons = async (req, res) => {
    try {
        const { rows } = await pool.query('select * from pokemons')

        const pokemons = rows.map(pokemon => {
            return {
                ...pokemon,
                skills: pokemon.skills.split(', '),
            }
        })

        return res.json(pokemons)

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const getPokemonById = async (req, res) => {
    const { id } = req.params

    try {
        const { rowCount, rows } = await pool.query(
            'select * from pokemons where id = $1',
            [id]
        )

        if (rowCount < 1) {
            return res.status(404).json({ message: 'Pokemon not found' })
        }

        return res.json(rows[0])

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const deletePokemon = async (req, res) => {
    const { id } = req.params

    try {
        const { rowCount } = await pool.query(
            'select * from pokemons where id = $1',
            [id]
        )

        if (rowCount < 1) {
            return res.status(404).json({ message: 'Pokemon not found' })
        }

        await pool.query('delete from pokemons where id = $1', [id])

        return res.status(204).send()

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = {
    registerPokemon,
    updatePokemon,
    getPokemons,
    getPokemonById,
    deletePokemon
}