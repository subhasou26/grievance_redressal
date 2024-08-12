// Function to generate a random password
function generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-='
    const passwordLength = 12; // adjust the length to your desired value
    let password = '';
  
    for (let i = 0; i < passwordLength; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  
    return password;
  }
  
  // Get the form and input elements
  const form = document.getElementById('create-user-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const roleInput = document.getElementById('role');
  const generatedPasswordInput = document.getElementById('generated-password');
  const passwordContainer = document.getElementById('password-container');
  const errorMessage = document.getElementById('error-message');
  
  // Add event listener to the form
  form.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const name = nameInput.value;
    const email = emailInput.value;
    const role = roleInput.value;
  
    if (!name || !email || !role) {
      errorMessage.textContent = 'Please fill in all fields';
      return;
    }
  
    // Generate a password
    const password = generatePassword();
    generatedPasswordInput.value = password;
  
    // Show the generated password
    passwordContainer.style.display = 'block';
  
    // TO DO: Call API or send request to create user
    console.log('Create user:', { name, email, role, password });
  
    // Clear form fields manually
    // nameInput.value = '';
    // emailInput.value = '';
    // roleInput.value = '';
  
    // errorMessage.textContent = '';
    alert("Succfull");
  });