/* eslint-disable no-unused-vars */
import { Builder, By, Key, until } from 'selenium-webdriver';

async function testSubmitIngredients() {
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    // Step 1: Navigate to the web application
    await driver.get('http://localhost:7000');
    await driver.findElement(By.id('guest_button')).click();

    // Ensure the ingredients page is loaded
    await driver.wait(until.elementLocated(By.id('ingredientSearch')), 10000);

    // Step 2: Simulate selecting ingredients
    // Note: Modify these selectors to match those in your application
    const ingredient1 = await driver.findElement(By.xpath("//button[text()='Tomato']"));
    const ingredient2 = await driver.findElement(By.xpath("//button[text()='Basil']"));
    await ingredient1.click();
    await ingredient2.click();

    // Step 3: Submit selected ingredients
    const submitButton = await driver.findElement(By.id('submitIngredientsButton'));
    await submitButton.click();

    // Step 4: Verification
    // Verify that recipes are displayed
    // Here, we expect at least one recipe section to appear
    await driver.wait(until.elementLocated(By.css('.recipeContainer .recipeSector')), 20000);
    const recipesVisible = await driver.findElements(By.css('.recipeContainer .recipeSector'));
    console.log('Number of recipes displayed:', recipesVisible.length);

    if (recipesVisible.length > 0) {
      console.log('Test Passed: Recipes are displayed based on selected ingredients.');
    } else {
      console.log('Test Failed: No recipes are displayed.');
    }
  } finally {
    await driver.quit();
  }
}

testSubmitIngredients();
