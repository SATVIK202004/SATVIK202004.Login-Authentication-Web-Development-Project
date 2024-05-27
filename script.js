const loginForm = document.getElementById('loginForm');
const forgotPasswordLink = document.getElementById('forgotPassword');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const { token } = await response.json();
      
      console.log('Login successful. Token:', token);
    } else {
      const { error } = await response.json();
      alert(error);
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred. Please try again later.');
  }
});

forgotPasswordLink.addEventListener('click', async (event) => {
  event.preventDefault();

  const username = prompt('Enter your username:');

  try {
    const response = await fetch('http://localhost:3000/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    });

    if (response.ok) {
      alert('Password reset instructions have been sent to your email.');
    } else {
      const { error } = await response.json();
      alert(error);
    }