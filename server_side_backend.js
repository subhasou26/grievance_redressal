const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const secretKey = '6LfovVIqAAAAAFWpA3fHGwaAtQ8_oQSl6dS1HUP3';

app.post('/login', async (req, res) => {
    const recaptchaResponse = req.body['g-recaptcha-response'];
    
    // Verify CAPTCHA with Google
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

    try {
        const captchaVerification = await axios.post(verifyUrl);

        if (captchaVerification.data.success) {
            // CAPTCHA is valid, proceed with login logic
            const username = req.body.username;
            const password = req.body.password;

            // Example login check (you can replace this with your real authentication logic)
            if (username === 'admin' && password === 'password') {
                res.json({ success: true, message: 'Login successful!' });
            } else {
                res.json({ success: false, message: 'Invalid username or password' });
            }
        } else {
            // CAPTCHA verification failed
            res.json({ success: false, message: 'CAPTCHA verification failed' });
        }
    } catch (error) {
        res.json({ success: false, message: 'Error verifying CAPTCHA' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
