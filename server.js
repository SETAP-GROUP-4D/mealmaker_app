import * as db from './dbConnection.js';
import express from 'express';
import path from 'path';
import bcrypt from 'bcrypt';

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

async function postUser(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await db.createUser(req.body.email, hashedPassword);
    res.json({ ACCOUNT_ID: result.lastID });
  } catch (error) {
    console.log('Internal Server Error', error);
  }
}

async function getUser(req, res) {
  try {
    const user = await db.authenticateUser(req.body.email);
    if (user && await bcrypt.compare(req.body.password, user.hashedPassword)) {
      res.json({ ACCOUNT_ID: user.id });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.log('Internal Server Error', error);
  }
}

app.get('/data/ingredients', getIngredients);
app.post('/data/recipes', express.json(), getRecipes);
app.post('/data/users', express.json(), postUser);
app.post('/data/users', express.json(), getUser);

app.get('/*', (req, res) => {
  res.sendFile(path.resolve('client', 'index.html'));
});

// make the server available on the network
app.listen(8080);
