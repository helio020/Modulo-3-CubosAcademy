const { Router } = require('express')
const controller = require('../controller/autores')

const router = Router()

router.post('/autor', controller.cadastrarAutor)
router.get('/autor/:id', controller.buscarAutor)
router.post('/autor/:id/livro', controller.cadastrarLivro)
router.get('/livro', controller.listarLivros)

module.exports = router