const instanceAxios = require('../api')
const fs = require('fs/promises')
const qs = require('qs')
const apiKey = require('../apiKey')

const consultarDados = async (req, res) => {
    const { dominioEmpresa } = req.params

    const object = {
        api_key: apiKey,
        domain: dominioEmpresa
    }

    try {
        const queryString = qs.stringify(object)

        const { data: dados } = await instanceAxios.get(`https://companyenrichment.abstractapi.com/v1?${queryString}`)

        if (!dados.name) {
            return res.status(400).json({ mensagem: 'O nome da empresa não está preenchido corretamente' })
        }

        const lerArquivo = await fs.readFile('./src/empresas.json')

        const empresas = JSON.parse(lerArquivo)

        empresas.push(dados)

        const empresasJson = JSON.stringify(empresas)

        await fs.writeFile('./src/empresas.json', empresasJson)

        return res.status(200).json(dados)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: error.message })
    }
}

module.exports = {
    consultarDados
}