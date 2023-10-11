const { Router } = require('express')
const { consultarDados } = require('../controller/consultarDados')

const router = Router()

router.get('/empresas/:dominioEmpresa', consultarDados)

module.exports = router