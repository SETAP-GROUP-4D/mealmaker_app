/* eslint-disable no-undef */
import { Builder, By, Key, until } from 'selenium-webdriver';

async function testIngredientSearch() {
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://localhost:8080');

    await driver.findElement(By.id('guest_button')).click();
    await driver.wait(until.elementLocated(By.id('ingredientSearch')), 1000);
    const searchBox = await driver.findElement(By.id('ingredientSearch'));
    await searchBox.sendKeys('basil', Key.RETURN);

    const hasResults = await driver.wait(until.elementLocated(By.css('.listSector')), 20000);
    console.log('Search results are visible:', !!hasResults);
  } finally {
    await driver.quit();
  }
}

testIngredientSearch();
