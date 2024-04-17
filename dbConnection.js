import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// this is for user authentication
// import uuid from 'uuid-random';
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

// Initialize the database connection
async function init() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
    verbose: true,
  });
  await db.migrate({ migrationsPath: './migrations-sqlite' });
  return db;
}

const dbConn = init();

// export async function createUser(username, password) {}

// export async function authenticateUser(username, password) {}

export async function sendIngredients() {
  const db = await dbConn;
  const ingredients = await db.all('SELECT * FROM INGREDIENT ORDER BY INGREDIENT_NAME ASC');
  return ingredients;
}

export async function sendRecipes(ingredients) {
  // Edamam API credentials
  const APP_ID = process.env.APP_ID;
  const APP_KEY = process.env.APP_KEY;

  const params = {
    type: 'public',
    q: ingredients.join(','),
    app_id: APP_ID,
    app_key: APP_KEY,
  };

  const response = await axios.get('https://api.edamam.com/api/recipes/v2', { params });
  const recipes = response.data.hits.map(hit => hit.recipe);

  return recipes;
}
