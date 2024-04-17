--Up

-- account table
CREATE TABLE ACCOUNT(
ACCOUNT_ID INTEGER PRIMARY KEY AUTOINCREMENT,
ACCOUNT_FNAME VARCHAR(35) NOT NULL,
ACCOUNT_LNAME VARCHAR(35) NOT NULL,
EMAIL VARCHAR(255) NOT NULL,
PASSWORD VARCHAR(255) NOT NULL
);

-- recipe table
CREATE TABLE RECIPE(
RECIPE_ID INTEGER PRIMARY KEY AUTOINCREMENT,
RECIPE_NAME VARCHAR(50) NOT NULL,
COOKING_STEP TEXT NOT NULL,
CUISINE_TYPE VARCHAR(20) NOT NULL,
PREPARATION_TIME INTEGER NOT NULL,
NUTRITIONAL_INFO TEXT NOT NULL
);

-- saved_recipe table 
CREATE TABLE SAVED_RECIPE(
ACCOUNT_ID INTEGER NOT NULL,
RECIPE_ID INTEGER NOT NULL,
DATE_SAVED DATETIME DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (ACCOUNT_ID, RECIPE_ID),
FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNT(ACCOUNT_ID),
FOREIGN KEY (RECIPE_ID) REFERENCES RECIPE(RECIPE_ID)
);

-- ingredient table
CREATE TABLE INGREDIENT(
INGREDIENT_ID INTEGER PRIMARY KEY AUTOINCREMENT,
INGREDIENT_NAME TEXT NOT NULL,
CATEGORY VARCHAR(50) NOT NULL
);

-- INSERT INTO ingredient table
INSERT INTO INGREDIENT (INGREDIENT_NAME, CATEGORY) VALUES
('Salt', 'pantry'),
('Carrots', 'vegetables'),
('Mushrooms', 'mushrooms'),
('Cherry tomatoes', 'fruit'),
('Raisins', 'fruit'),
('Pine nuts', 'nuts'),
('Parmesan', 'cheese'),
('Milk', 'dairy'),
('Tofu', 'dairy-Free'),
('Ground beef', 'meat'),
('Chicken breasts', 'poultry'),
('Salmon', 'fish'),
('Shrimp', 'seafood'),
('Basil', 'spices'),
('Sugar', 'sugar'),
('Paprika', 'seasonings'),
('Baking soda', 'baking'),
('Tortillas', 'pre-made'),
('Basmati rice', 'grains&cereal'),
('Chickpeas', 'legumes'),
('Linguine', 'pasta'),
('Bread', 'bread'),
('Olive oil', 'oils&fats'),
('Vinegar', 'dressings'),
('Mustard', 'condiments'),
('Canned tomatoes', 'cannedFood'),
('Tomato sauce', 'sauces'),
('Hummus', 'spreads'),
('Beef stock', 'soups'),
('Chocolate', 'desserts'),
('Red wine', 'alcohol'),
('Coffee', 'beverages'),
('Vanilla extract', 'supplements');

