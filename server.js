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
  res.json(await db.sendRecipes(req.body.ingredients, req.body.cuisineType));
}

async function postUser(req, res) {
  try {
    const existingUser = await db.getUser(req.body.email);
    if (existingUser) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await db.createUser(req.body.email, hashedPassword);
    res.json({ ACCOUNT_ID: result.lastID });
  } catch (error) {
    console.log('Internal Server Error', error);
  }
}

async function authenticateUser(req, res) {
  try {
    const user = await db.getUser(req.body.email);
    if (user && await bcrypt.compare(req.body.password, user.hashedPassword)) {
      res.json({ ACCOUNT_ID: user.id });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.log('Internal Server Error', error);
  }
}

async function postBookmark(req, res) {
  try {
    const result = await db.createBookmark(req.body.userId, req.body.recipeObj);
    res.json({ BOOKMARK_ID: result.lastID });
  } catch (error) {
    console.log('Internal Server Error', error);
  }
}

async function getBookmarks(req, res) {
  const bookmarks = await db.sendBookmarks(req.params.id);
  if (bookmarks) {
    res.json(bookmarks);
  } else {
    res.status(404).send('No match for that ID.');
  }
}

async function deleteBookmark(req, res) {
  const result = await db.deleteBookmarkFromDatabase(req.body.userId, req.body.recipeId);
  res.json(result);
}

app.get('/data/ingredients', getIngredients);
app.post('/data/recipes', express.json(), getRecipes);
app.post('/data/users/register', express.json(), postUser);
app.post('/data/users/login', express.json(), authenticateUser);
app.post('/data/bookmarks', express.json(), postBookmark);
app.get('/data/bookmarks/:id', getBookmarks);
app.delete('/data/bookmarks', express.json(), deleteBookmark);

app.get('/*', (req, res) => {
  res.sendFile(path.resolve('client', 'index.html'));
});

// make the server available on the network
app.listen(8080);
