const http = require('http');
const {Pool} = require('pg');
const pool = new Pool({
    user: "postgres",
    password: "jusstsdk",
    host: "localhost",
    port: 5432,
    database: "foodtracker"
})

const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    if (req.url === '/recipes') {
        await getRecipes(res)
    }
    else if (req.method === 'GET' && req.url === '/users') {
        await getUsers(res)
    }
    else if (req.method === 'POST' && req.url === '/users') {
        await addUser(req, res);
    }
    else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
})

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});

async function getRecipes(res) {
    const client = await pool.connect()
    try {
        const result = await client.query('SELECT * FROM recipes')
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        res.end(JSON.stringify(result.rows))
    } finally {
        client.release()
    }
}

async function getUsers(res) {
    const client = await pool.connect()
    try {
        const result = await client.query('SELECT * FROM users')
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        res.end(JSON.stringify(result.rows))
    } finally {
        client.release()
    }
}

async function addUser(req, res) {
    const client = await pool.connect();
    try {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', async () => {
            const { username, email, password, age, bmi, height, image } = JSON.parse(data);
            const result = await client.query(
                'INSERT INTO users (username, email, password, age, bmi, height, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [username, email, password, age, bmi, height, image]
            );
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify(result.rows[0]));
        });
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
        res.end('Internal Server Error');
    } finally {
        client.release();
    }
}