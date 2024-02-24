import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import uuid from 'uuid-random';

const bcrypt = require('bcrypt');
const saltRounds = 10;


async function init() {
    const db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database,
      verbose: true,
    });
    await db.migrate({ migrationsPath: './database' });
    return db;
}

export async function createUser(username, password) {}

export async function authenticateUser(username, password) {}

export async function getRecipe(recipe) {}

export async function getSavedRecipes() {}
