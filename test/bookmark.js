/* eslint-disable no-undef */
function isRecipeBookmarked(recipeObj, bookmarks) {
  return bookmarks.some(bookmark => bookmark.uri === recipeObj.uri);
}


// Function to fetch bookmarks
async function fetchBookmarks() {
  const userId = localStorage.getItem('currentUserId');
  const response = await fetch(`data/bookmarks/${userId}`);
  if (response.ok) {
    const bookmarks = await response.json();
    const bookmarkObjects = bookmarks.map(bookmark => JSON.parse(bookmark.RECIPE_OBJECT));
    console.log(bookmarkObjects, 'bookmarks');
    appendRecipesToBookmarksPage(bookmarkObjects);
    return bookmarkObjects;
  } else {
    console.log('failed to load bookmarks', response);
    return [];
  }
}

module.exports = { isRecipeBookmarked, fetchBookmarks };
