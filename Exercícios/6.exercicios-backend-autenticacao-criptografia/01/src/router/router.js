const { Router } = require('express')
const { registerUser, login, getProfile } = require('../controller/user')
const verifyLoggedInUser = require('../middleware/authentication')
const { registerPokemon, updatePokemon, getPokemons, getPokemonById, deletePokemon } = require('../controller/pokemon')

const router = Router()

router.post('/user', registerUser)
router.post('/login', login)

router.use(verifyLoggedInUser)

router.get('/profile', getProfile)

router.post('/pokemon', registerPokemon)
router.patch('/pokemon/:id', updatePokemon)
router.get('/pokemon', getPokemons)
router.get('/pokemon/:id', getPokemonById)
router.delete('/pokemon/:id', deletePokemon)

module.exports = router