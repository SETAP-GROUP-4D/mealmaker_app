import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

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

export async function createUser(email, password) {
  const db = await dbConn;
  const result = await db.run(`
    INSERT INTO ACCOUNT (ACCOUNT_ID, EMAIL, PASSWORD) 
    VALUES (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-a' || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))), ?, ?)
  `, email, password);
  return result;
}

export async function getUser(email) {
  const db = await dbConn;
  const result = await db.get(`
    SELECT ACCOUNT_ID AS id, PASSWORD AS hashedPassword
    FROM ACCOUNT
    WHERE EMAIL = ?`, email);
  return result;
}

export async function sendIngredients() {
  const db = await dbConn;
  const ingredients = await db.all(`
    SELECT INGREDIENT.ingredient_name, INGREDIENT.category 
    FROM INGREDIENT 
    INNER JOIN (
      SELECT DISTINCT ingredient_name 
      FROM INGREDIENT
    ) AS DISTINCT_INGREDIENTS 
    ON INGREDIENT.ingredient_name = DISTINCT_INGREDIENTS.ingredient_name 
    ORDER BY INGREDIENT.ingredient_name ASC
  `);
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

export async function createBookmark(accountId, recipeObj) {
  const db = await dbConn;

  // Insert into RECIPE table
  await db.run(`
    INSERT INTO RECIPE (RECIPE_ID, RECIPE_OBJECT) 
    VALUES (?, ?)
    ON CONFLICT(RECIPE_ID) DO NOTHING
  `, recipeObj.uri, JSON.stringify(recipeObj));

  // Insert into SAVED_RECIPE table
  const result = await db.run(`
    INSERT INTO SAVED_RECIPE (ACCOUNT_ID, RECIPE_ID) 
    VALUES (?, ?)
  `, accountId, recipeObj.uri);

  return result;
}

export async function sendBookmarks(accountId) {
  const db = await dbConn;
  const bookmarks = await db.all(`
    SELECT RECIPE.RECIPE_OBJECT 
    FROM SAVED_RECIPE 
    INNER JOIN RECIPE 
    ON SAVED_RECIPE.RECIPE_ID = RECIPE.RECIPE_ID 
    WHERE ACCOUNT_ID = ?
  `, accountId);

  // Parse the JSON strings into objects
  const bookmarkObjects = bookmarks.map(bookmark => JSON.parse(bookmark.RECIPE_OBJECT));

  return bookmarkObjects;
}

export async function verifyBookmark(accountId, recipeId) {
  const db = await dbConn;
  const result = await db.get(`
    SELECT * 
    FROM SAVED_RECIPE 
    WHERE ACCOUNT_ID = ? AND RECIPE_ID = ?
  `, accountId, recipeId);

  return result;
}
