document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();  // Prevent the default form submission

    // Get the reCAPTCHA response token
    const recaptchaResponse = grecaptcha.getResponse();

    // Check if the CAPTCHA is solved
    if (recaptchaResponse.length === 0) {
        alert('Please complete the CAPTCHA');
    } else {
        // CAPTCHA is solved, proceed with form submission or AJAX request

        // Create form data
        const formData = new FormData(this);
        formData.append('g-recaptcha-response', recaptchaResponse);

        // Send the data to your server
        fetch('/login', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // CAPTCHA and login successful
                alert('Login successful');
                window.location.href = '/dashboard';  // Redirect to dashboard or another page
            } else {
                // CAPTCHA failed or login failed
                alert('Login failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during login');
        });
    }
});

