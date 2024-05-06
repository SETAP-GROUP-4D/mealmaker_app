function searchIngredients() {
  const ingredientSectionsContainer = document.querySelectorAll('.categoryIngredients');
  const lowerCaseQuery = global.ingredientSearch.value.toLowerCase();
  ingredientSectionsContainer.forEach(container => {
    const containerSection = container.querySelector('section');
    const items = Array.from(containerSection.children);
    let containerHasMatchingItem = false;
    for (const item of items) {
      const itemName = item.textContent.toLowerCase();
      if (itemName.includes(lowerCaseQuery)) {
        item.style.display = '';
        containerHasMatchingItem = true;
      } else {
        item.style.display = 'none';
      }
    }
    container.style.display = containerHasMatchingItem ? '' : 'none';
  });
}

module.exports = { searchIngredients };
