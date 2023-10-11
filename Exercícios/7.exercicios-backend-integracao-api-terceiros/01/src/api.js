const axios = require('axios')

const instanceAxios = axios.create({
    headers: {
        'Content-type': 'application/x-www-form-urlencoded'
    }
})

module.exports = instanceAxios