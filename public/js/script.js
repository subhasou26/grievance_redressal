const form = document.getElementById('signup-form');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('first-name').value;
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!firstName || !email || !password) {
        errorMessage.textContent = 'Please fill in all fields.';
        return;
    }

    // TO DO: Add validation for email and password

    // TO DO: Send request to server to create new user

    alert('Signup successful!');
});