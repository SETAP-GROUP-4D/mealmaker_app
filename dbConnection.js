import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initialize the database connection.
 * @async
 * @function init
 * @returns {Promise<Object>} The database connection object.
 */
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

/**
 * Create a new user account in the database.
 * @async
 * @function createUser
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} The result of the database operation.
 */
export async function createUser(email, password) {
  const db = await dbConn;
  const result = await db.run(`
    INSERT INTO ACCOUNT (ACCOUNT_ID, EMAIL, PASSWORD) 
    VALUES (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-a' || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))), ?, ?)
  `, email, password);
  return result;
}

/**
 * Get a user account from the database by email.
 * @async
 * @function getUser
 * @param {string} email - The user's email address.
 * @returns {Promise<Object>} The user account object, or null if not found.
 */
export async function getUser(email) {
  const db = await dbConn;
  const result = await db.get(`
    SELECT ACCOUNT_ID AS id, PASSWORD AS hashedPassword
    FROM ACCOUNT
    WHERE EMAIL = ?`, email);
  return result;
}

/**
 * Get all ingredients from the database.
 * @async
 * @function sendIngredients
 * @returns {Promise<Array>} An array of ingredient objects.
 */
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

/**
 * Get recipes from the Edamam API based on ingredients and cuisine type.
 * @async
 * @function sendRecipes
 * @param {Array} ingredients - An array of ingredient names.
 * @param {Array} cuisineType - An array of cuisine types.
 * @returns {Promise<Array>} An array of recipe objects.
 */
export async function sendRecipes(ingredients, cuisineType) {
  // Edamam API credentials
  const APP_ID = process.env.APP_ID;
  const APP_KEY = process.env.APP_KEY;

  const params = {
    type: 'public',
    q: ingredients.join(','),
    app_id: APP_ID,
    app_key: APP_KEY,
  };

  // Add cuisineType parameter if provided
  if (cuisineType && cuisineType.length > 0) {
    params.cuisineType = cuisineType.join(',');
  }

  const response = await axios.get('https://api.edamam.com/api/recipes/v2', { params });
  const recipes = response.data.hits.map(hit => hit.recipe);

  return recipes;
}

/**
 * Create a new bookmark in the database for a user and recipe.
 * @async
 * @function createBookmark
 * @param {string} accountId - The user's account ID.
 * @param {Object} recipeObj - The recipe object to bookmark.
 * @returns {Promise<Object>} The result of the database operation.
 */
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

/**
 * Get bookmarks for a specific user from the database.
 * @async
 * @function sendBookmarks
 * @param {string} accountId - The user's account ID.
 * @returns {Promise<Array>} An array of bookmark objects.
 */
export async function sendBookmarks(accountId) {
  const db = await dbConn;
  const bookmarks = await db.all(`
    SELECT RECIPE.RECIPE_OBJECT 
    FROM SAVED_RECIPE 
    INNER JOIN RECIPE 
    ON SAVED_RECIPE.RECIPE_ID = RECIPE.RECIPE_ID 
    WHERE ACCOUNT_ID = ?
  `, accountId);

  return bookmarks;
}

/**
* Delete a bookmark from the database for a specific user and recipe.
* @async
* @function deleteBookmarkFromDatabase
* @param {string} accountId - The user's account ID.
* @param {string} recipeId - The recipe ID.
* @returns {Promise<Object>} The result of the database operation.
*/
export async function deleteBookmarkFromDatabase(accountId, recipeId) {
  const db = await dbConn;
  const result = await db.run(`
    DELETE FROM SAVED_RECIPE 
    WHERE ACCOUNT_ID = ? AND RECIPE_ID = ?
  `, accountId, recipeId);

  return result;
}
