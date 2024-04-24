import * as db from './dbConnection.js';
import express from 'express';
import path from 'path';

// create an Express.js server (aka app)
const app = express();

// Serve files from the 'client' directory
app.use(express.static('client'));

async function getIngredients(req, res) {
  res.json(await db.sendIngredients());
}

async function getRecipes(req, res) {
  res.json(await db.sendRecipes(req.body));
}

app.get('/data/ingredients', getIngredients);
app.post('/data/ingredients', express.json(), getRecipes);

app.get('/*', (req, res) => {
  res.sendFile(path.resolve('client', 'index.html'));
});

// make the server available on the network
app.listen(8080);
