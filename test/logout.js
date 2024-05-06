/* eslint-disable no-undef */
function logOut() {
  localStorage.clear();
  navigateTo('/');
  location.reload(true);
}

module.exports = { logOut };
