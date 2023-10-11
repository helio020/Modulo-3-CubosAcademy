const pool = require('../connection/conexao')
const { format } = require('date-fns')

const cadastrarAutor = async (req, res) => {
    const { nome, idade } = req.body

    try {
        if (!nome) {
            return res.status(400).json({ mensagem: 'O campo nome é obrigatório.' })
        }

        const query = 'insert into autores (nome, idade) values ($1, $2)'
        const params = [nome, Number(idade)]
        await pool.query(query, params)

        const query2 = 'select * from autores'
        const result = await pool.query(query2)

        const object = {
            id: result.rowCount,
            nome,
            idade: Number(idade)
        }
        return res.status(201).json(object)

    } catch (error) {
        console.log(error.message)
    }
}

const buscarAutor = async (req, res) => {
    const { id } = req.params

    try {
        const query = 'select * from autores'
        const result = await pool.query(query)

        const autor = result.rows.find((row) => row.id === Number(id))

        if (!autor) {
            return res.status(404).json({ mensagem: 'Autor não encontrado' })
        }

        const query2 = `
            select l.id, l.nome, l.genero, l.editora, l.data_publicacao, l.id_autor
            from autores a 
            join livros l on a.id = l.id_autor;
        `
        const result2 = await pool.query(query2)
        const rows = result2.rows

        const filtrarLivros = rows.filter((row) => row.id_autor === Number(id))

        if (filtrarLivros.length === 0) {
            return res.status(404).json({ mensagem: 'Livro não encontrado.' })
        }

        for (const livro of filtrarLivros) {
            delete livro.id_autor
        }

        const livros = filtrarLivros.map(livro => {
            return {
                ...livro,
                data_publicacao: format(new Date(livro.data_publicacao), 'yyyy-MM-dd')
            }
        })

        const object = {
            id: autor.id,
            nome: autor.nome,
            idade: autor.idade,
            livros
        }

        return res.status(200).json(object)

    } catch (error) {
        console.log(error.message)
    }
}

const cadastrarLivro = async (req, res) => {
    const { id } = req.params
    const { nome, genero, editora, data_publicacao } = req.body

    try {
        if (!nome) {
            return res.status(400).json({ mensagem: 'O campo nome é obrigatório.' })
        }

        const query = `
            insert into livros (nome, genero, editora, data_publicacao, id_autor) values
            ($1, $2, $3, $4, $5)
        `
        const params = [nome, genero, editora, data_publicacao, Number(id)]
        await pool.query(query, params)

        const query2 = 'select * from livros'
        const result = await pool.query(query2)

        const object = {
            id: result.rowCount,
            nome,
            genero,
            editora,
            data_publicacao
        }
        return res.status(201).json(object)

    } catch (error) {
        console.log(error.message)
    }
}

const listarLivros = async (req, res) => {
    try {
        const query = `
            select l.id, l.nome, l.genero, l.editora, l.data_publicacao, a.id as autor_id, a.nome as nome_autor, a.idade
            from livros l 
            join autores a on l.id_autor = a.id;
        `
        const result = await pool.query(query)
        const rows = result.rows

        const livros = rows.map(livro => ({
            id: livro.id,
            nome: livro.nome,
            genero: livro.genero,
            editora: livro.editora,
            data_publicacao: format(new Date(livro.data_publicacao), 'yyyy-MM-dd'),
            autor: {
                id: livro.autor_id,
                nome: livro.nome_autor,
                idade: livro.idade
            }
        }))

        return res.status(200).json(livros)

    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    cadastrarAutor,
    buscarAutor,
    cadastrarLivro,
    listarLivros
}