import * as db from './dbConnection.js';
import express from 'express';
import path from 'path';
import bcrypt from 'bcrypt';

/**
 * Create an Express.js server (aka app).
 * @type {express.Application}
 */
const app = express();

// Serve files from the 'client' directory
app.use(express.static('client'));

/**
 * Get ingredients from the database and send them as a JSON response.
 * @async
 * @function getIngredients
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function getIngredients(req, res) {
  res.json(await db.sendIngredients());
}

/**
 * Get recipes from the Edamam API based on ingredients and cuisine type, and send them as a JSON response.
 * @async
 * @function getRecipes
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function getRecipes(req, res) {
  res.json(await db.sendRecipes(req.body.ingredients, req.body.cuisineType));
}

/**
 * Create a new user account in the database.
 * @async
 * @function postUser
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
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

/**
 * Authenticate a user by checking the provided email and password against the database.
 * @async
 * @function authenticateUser
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
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

/**
 * Create a new bookmark in the database for a user and recipe.
 * @async
 * @function postBookmark
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function postBookmark(req, res) {
  try {
    const result = await db.createBookmark(req.body.userId, req.body.recipeObj);
    res.json({ BOOKMARK_ID: result.lastID });
  } catch (error) {
    console.log('Internal Server Error', error);
  }
}

/**
 * Get bookmarks for a specific user from the database and send them as a JSON response.
 * @async
 * @function getBookmarks
 * @param {Object} req - The Express request object.
 * @param {string} req.params.id - The user ID.
 * @param {Object} res - The Express response object.
 */
async function getBookmarks(req, res) {
  const bookmarks = await db.sendBookmarks(req.params.id);
  if (bookmarks) {
    res.json(bookmarks);
  } else {
    res.status(404).send('No match for that ID.');
  }
}

/**
 * Delete a bookmark from the database for a specific user and recipe.
 * @async
 * @function deleteBookmark
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function deleteBookmark(req, res) {
  const result = await db.deleteBookmarkFromDatabase(req.body.userId, req.body.recipeId);
  res.json(result);
}

// Route handlers
app.get('/data/ingredients', getIngredients);
app.post('/data/recipes', express.json(), getRecipes);
app.post('/data/users/register', express.json(), postUser);
app.post('/data/users/login', express.json(), authenticateUser);
app.post('/data/bookmarks', express.json(), postBookmark);
app.get('/data/bookmarks/:id', getBookmarks);
app.delete('/data/bookmarks', express.json(), deleteBookmark);

/**
 * Catch-all route handler to serve the index.html file for all other routes.
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
app.get('/*', (req, res) => {
  res.sendFile(path.resolve('client', 'index.html'));
});

// make the server available on the network
app.listen(8080);
