/* eslint-disable no-undef */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function sendLoginDetails() {
  if (!isValidEmail(global.loginEmail.value)) {
    global.invalidLoginEmail.textContent = 'Please enter a valid email address.';
  } else {
    const email = global.loginEmail.value;
    const password = global.loginPassword.value;

    const payload = { email, password };
    const response = await fetch('data/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(error => {
      console.error('Failed to fetch:', error);
    });

    if (response.ok) {
      const user = await response.json();
      console.log('User ID sent');
      console.log(user, 'from database');

      // clear local storage
      localStorage.clear();
      localStorage.setItem('currentUserId', user.ACCOUNT_ID);
      global.invalidDetails.textContent = '';
      global.loginEmail.value = '';
      global.loginPassword.value = '';
      navigateTo('/ingredients');
    } else if (response.status === 401) {
      global.invalidDetails.textContent = 'Invalid email or password. Please check your credentials and try again.';
    }
  }
}

async function sendSignupDetails() {
  if (!isValidEmail(global.signupEmail.value)) {
    global.invalidSignupEmail.textContent = 'Please enter a valid email address.';
  } else {
    const email = global.signupEmail.value;
    const password = global.signupPassword.value;

    const payload = { email, password };
    const response = await fetch('data/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(error => {
      console.error('Failed to fetch:', error);
    });

    if (response.ok) {
      console.log('User created successfully');
      global.invalidDetails.textContent = '';
      global.invalidLoginEmail.textContent = '';
      global.loginEmail.value = '';
      global.loginPassword.value = '';
      global.signupEmail.value = '';
      global.signupPassword.value = '';
      navigateTo('/');
    } else {
      console.log('failed to create user', response);
    }
  }
}


module.exports = { isValidEmail, sendLoginDetails, sendSignupDetails };
