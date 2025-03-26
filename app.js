const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})
