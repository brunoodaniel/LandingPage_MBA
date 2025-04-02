const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./inscricoes.db');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Criar a tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS inscricoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT NOT NULL,
    ocupacao TEXT NOT NULL,
    renda REAL NOT NULL,
    escolaridade TEXT NOT NULL
)`);

// Rota para registrar uma nova inscrição
app.post('/inscrever', (req, res) => {
    const { nome, email, telefone, ocupacao, renda, escolaridade } = req.body;

    // Verifica se o email já existe
    db.get('SELECT * FROM inscricoes WHERE email = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao verificar o email' });
        }
        if (row) {
            return res.status(400).json({ error: 'Este email já está cadastrado' });
        }

        // Insere novo registro
        db.run(`INSERT INTO inscricoes (nome, email, telefone, ocupacao, renda, escolaridade)
                VALUES (?, ?, ?, ?, ?, ?)`, 
                [nome, email, telefone, ocupacao, renda, escolaridade], 
                function (err) {
            if (err) {
                return res.status(500).json({ error: 'Erro ao salvar a inscrição' });
            }
            res.status(201).json({ message: 'Inscrição realizada com sucesso!' });
        });
    });
});

app.delete('/inscricoes/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM inscricoes WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Erro ao excluir a inscrição' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Inscrição não encontrada' });
        }
        res.json({ message: 'Inscrição excluída com sucesso!' });
    });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
