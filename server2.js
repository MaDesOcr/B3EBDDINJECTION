const express = require('express');
const mysql = require('mysql2/promise'); // 🔥 Version Promises

const app = express();
app.use(express.json());

async function getConnection() {
    return await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "cinema",
    });
}

app.get('/inject', async (req, res) => {
    const connection = await getConnection();
    try {
        const { nom } = req.query;

        const query = `SELECT id, nom, prenom, annee_naissance FROM Artiste WHERE nom LIKE '${nom}'`;
        console.log("Requête exécutée :", query);
//http://localhost:3000/inject?nom=' UNION SELECT schema_name, 'x', 'x', 'x' FROM information_schema.schemata -- 
        const [rows] = await connection.query(query); 
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});
