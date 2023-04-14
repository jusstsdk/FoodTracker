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
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    if (req.url === '/recipes') {
        await getRecipes(res)
    } else if (req.url.startsWith('/recipes/category/')) {
        await getRecipesByCategoryId(req, res);
    } else if (req.url === '/categories') {
        await getCategories(res)
    } else if (req.url === '/foodlist') {
        await getFoodList(res)
    } else if (req.method === 'POST' && req.url.startsWith('/meals_history/')) {
        await updateMealsHistory(req, res)
    } else if (req.url.startsWith('/favorites/')) {
        await getFavorites(req, res)
    } else if (req.method === 'POST' && req.url === '/favorites') {
        await addFavorite(req, res)
    } else if (req.method === 'DELETE' && req.url === '/favorites') {
        await deleteFavorite(req, res)
    } else if (req.method === 'GET' && req.url === '/users') {
        await getUsers(res)
    } else if (req.method === 'POST' && req.url === '/users') {
        await addUser(req, res);
    } else if (req.method === 'PUT' && req.url.startsWith('/users/') && req.url.endsWith('/image')) {
        await updateUserImage(req, res);
    } else if (req.method === 'PUT' && req.url.startsWith('/users/') && req.url.endsWith('/weight')) {
        await updateUserWeight(req, res);
    } else if (req.method === 'PUT' && req.url.startsWith('/users/')) {
        await updateUser(req, res);
    } else if (req.method === 'GET' && req.url.startsWith('/meals/user/')) {
        await getUserMeals(req, res)
    } else if (req.method === 'GET' && req.url.startsWith('/water/user/')) {
        await getUserWater(req, res)
    } else if (req.method === 'POST' && req.url.startsWith('/water_history/')) {
        await addUserWater(req, res)
    } else {
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
        res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
        res.end(JSON.stringify(result.rows))
    } finally {
        client.release()
    }
}

async function getRecipesByCategoryId(req, res) {
    const categoryId = req.url.split('/').pop();
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM recipes WHERE category_id = $1', [categoryId]);
        res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
        res.end(JSON.stringify(result.rows));
    } finally {
        client.release();
    }
}

async function getCategories(res) {
    const client = await pool.connect()
    try {
        const result = await client.query('SELECT * FROM categories')
        res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
        res.end(JSON.stringify(result.rows))
    } finally {
        client.release()
    }
}

async function getFavorites(req, res) {
    const userId = req.url.split('/').pop();
    const client = await pool.connect()
    try {
        const result = await client.query('SELECT favorites.recipe_id, recipes.* FROM favorites JOIN recipes ON recipes.id = favorites.recipe_id WHERE favorites.user_id = $1', [userId])
        res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
        res.end(JSON.stringify(result.rows))
    } finally {
        client.release()
    }
}

async function addFavorite(req, res) {
    const client = await pool.connect();
    try {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', async () => {
            const {user_id, recipe_id} = JSON.parse(data);
            const result = await client.query(
                'INSERT INTO favorites (user_id, recipe_id) VALUES ($1, $2)',
                [user_id, recipe_id]
            );
            res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
            res.end(JSON.stringify(result.rows[0]));
        });
    } catch (err) {
        res.writeHead(500, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
        res.end('Internal Server Error');
    } finally {
        client.release();
    }
}

async function deleteFavorite(req, res) {
    const client = await pool.connect();
    try {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', async () => {
            const {user_id, recipe_id} = JSON.parse(data);
            const result = await client.query(
                'DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2',
                [user_id, recipe_id]
            );
            res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
            res.end(JSON.stringify(result.rows[0]));
        });
    } catch (err) {
        res.writeHead(500, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
        res.end('Internal Server Error');
    } finally {
        client.release();
    }
}

async function getUsers(res) {
    const client = await pool.connect()
    try {
        const result = await client.query('SELECT * FROM users')
        res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
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
            const {username, email, password, age, height, image} = JSON.parse(data);
            const result = await client.query(
                'INSERT INTO users (username, email, password, age, height, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [username, email, password, age, height, image]
            );
            res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
            res.end(JSON.stringify(result.rows[0]));
        });
    } catch (err) {
        res.writeHead(500, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
        res.end('Internal Server Error');
    } finally {
        client.release();
    }
}

async function updateUser(req, res) {
    const client = await pool.connect();
    try {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', async () => {
            const {id, username, age, height, weight} = JSON.parse(data);
            const result = await client.query(
                'UPDATE users SET username = $1, age = $2, height = $3, weight = $4 WHERE id = $5 RETURNING *',
                [username, age, height, weight, id]
            );

            res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
            res.end(JSON.stringify(result.rows[0]));
        });
    } catch (err) {
        res.writeHead(500, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
        res.end('Internal Server Error');
    } finally {
        client.release();
    }
}

async function updateUserImage(req, res) {
    const client = await pool.connect();
    try {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', async () => {
            const {id, image} = JSON.parse(data);
            const result = await client.query(
                'UPDATE users SET image = $1 WHERE id = $2 RETURNING *',
                [image, id]
            );

            res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
            res.end(JSON.stringify(result.rows[0]));
        });
    } catch (err) {
        res.writeHead(500, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
        res.end('Internal Server Error');
    } finally {
        client.release();
    }
}

async function updateUserWeight(req, res) {
    const client = await pool.connect();
    try {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', async () => {
            const {id, weight} = JSON.parse(data);
            const result = await client.query(
                'UPDATE users SET weight = $1 WHERE id = $2 RETURNING *',
                [weight, id]
            );
            res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
            res.end(JSON.stringify(result.rows[0]));
        });
    } catch (err) {
        res.writeHead(500, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
        res.end('Internal Server Error');
    } finally {
        client.release();
    }
}

async function getUserMeals(req, res) {
    const userId = req.url.split('/').pop();
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT meals_history.meal_id, food_list.name, food_list.calories ' +
            'FROM meals_history JOIN food_list ON food_list.id = meals_history.food_id ' +
            'WHERE meals_history.user_id = $1 AND date_mark = CURRENT_DATE', [userId]);
        res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
        res.end(JSON.stringify(result.rows));
    } finally {
        client.release();
    }
}

async function getUserWater(req, res) {
    const userId = req.url.split('/').pop();
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT value FROM water_history WHERE user_id = $1 AND date_mark = CURRENT_DATE', [userId]);
        res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
        res.end(JSON.stringify(result.rows));
    } finally {
        client.release();
    }
}

async function addUserWater(req, res) {
    const client = await pool.connect();
    try {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', async () => {
            const {user, value} = JSON.parse(data);
            const result = await client.query(
                'INSERT INTO water_history (user_id, value) VALUES ($1, $2)', [user, value]);
            res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
            res.end(JSON.stringify(result.rows[0]));
        });
    } catch (err) {
        res.writeHead(500, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
        res.end('Internal Server Error');
    } finally {
        client.release();
    }
}

async function getFoodList(res) {
    const client = await pool.connect()
    try {
        const result = await client.query('SELECT * FROM food_list')
        res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
        res.end(JSON.stringify(result.rows))
    } finally {
        client.release()
    }
}

async function updateMealsHistory(req, res) {
    const client = await pool.connect();
    try {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', async () => {
            const {user, meal, food} = JSON.parse(data);
            const result = await client.query(
                'INSERT INTO meals_history (user_id, meal_id, food_id) VALUES ($1, $2, $3)', [user, meal, food]);
            res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
            res.end(JSON.stringify(result.rows[0]));
        });
    } catch (err) {
        res.writeHead(500, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
        res.end('Internal Server Error');
    } finally {
        client.release();
    }
}
