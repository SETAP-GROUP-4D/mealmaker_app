# MealMaker - Recipe Suggestion Web App

MealMaker is a comprehensive web application that suggests recipes based on user-selected ingredients and cuisine preferences. It allows users to explore an extensive database of ingredients, search for specific items, and select the ones they wish to include in their recipes. The application then fetches relevant recipes from the Edamam API, a powerful recipe database, based on the chosen ingredients and an optional cuisine type. Users can view detailed information about each recipe, including cooking time, nutritional information, and instructions.

Additionally, MealMaker offers a user authentication system, allowing registered users to bookmark their favorite recipes for future reference. The application ensures a personalized experience by maintaining separate bookmarks for each user profile.

## Key Features

### Ingredient Selection and Search

MealMaker provides a comprehensive list of ingredients categorized into various groups, such as vegetables, fruits, meats, dairy products, spices, and more. Users can browse through these categories and select the ingredients they want to include in their recipes. Additionally, a search functionality allows users to quickly find specific ingredients by name.

### Recipe Suggestion and Filtering

Once the user selects the desired ingredients, MealMaker fetches relevant recipes from the Edamam API based on the selected items. The application also offers an optional cuisine type filter, allowing users to narrow down the results to specific cuisines, such as American, Asian, Italian, or Mexican.

### Recipe Details and Instructions

Upon selecting a recipe, users can view detailed information, including the recipe title, an image, a list of ingredients, allergies or dietary restrictions, health information, and a comprehensive breakdown of nutritional values. The application also provides a link to the original recipe source, allowing users to access the full instructions and any additional details.

### Bookmarking and User Authentication

MealMaker includes a user authentication system that allows users to create accounts and log in. Registered users can bookmark their favorite recipes for future reference. The bookmarked recipes are stored in a database and can be accessed from the user's profile at any time.

### Responsive Design

The application is designed to be responsive, ensuring a seamless experience across various devices and screen sizes, including desktops, tablets, and mobile phones.

## Technologies Used

MealMaker is built using the following technologies:

- **Front-end**: HTML, CSS, and Vanilla JavaScript
- **Back-end**: Node.js with Express.js
- **Database**: SQLite
- **API Integration**: Edamam API (for recipe data)
- **Authentication**: bcrypt (for password hashing)

## Installation and Usage

To run MealMaker locally, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/MealMaker.git`
2. Navigate to the project directory: `cd MealMaker`
3. Create a `.env` file in the project's root directory and copy the contents from `.env.sample`. Replace the placeholders with your own values. You can get your API details from [the edamam website](https://www.edamam.com/)
4. Install dependencies: `npm install`
5. Start the server: `npm start`
6. Open the application in your web browser at `http://localhost:8080`

Once the application is running, you can:

1. Browse or search for ingredients from the provided list.
2. Select the desired ingredients for your recipe.
3. Click the "Submit Ingredients" button to fetch relevant recipes.
4. Optionally, choose a cuisine type to filter the results or rank by cooking time.
5. View recipe details, including ingredients, allergies, health information, and nutritional values.
6. If logged in, bookmark your favorite recipes for future reference.
7. Access your bookmarked recipes by navigating to the "Bookmarks" section.

## API Integration

MealMaker integrates with the Edamam API to fetch recipe data based on the user's ingredient selection and cuisine preferences. The application sends a POST request to the server with the selected ingredients and optional cuisine type as the payload. The server then makes a request to the Edamam API, retrieves the relevant recipes, and returns them to the client for display.

## Database and User Authentication

MealMaker uses a SQLite database to store user account information and bookmarked recipes. The application employs bcrypt for password hashing, ensuring secure storage of user credentials.

When a user signs up, their email and hashed password are stored in the database. During the login process, the provided email and password are verified against the stored credentials.

Registered users can bookmark recipes, which are stored in the database associated with their user account. The bookmarked recipes can be retrieved and displayed in the "Bookmarks" section for each user.


## Future Enhancements

- Implement advanced search and filtering options for recipes, such as dietary restrictions or calorie range.
- Allow users to create and save their own custom recipes.
- Integrate social sharing features, enabling users to share recipes with others.
- Implement a rating and review system for recipes, fostering a community-driven experience.
- Enhance the user interface with animations and improved visual design.
