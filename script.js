document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chat-toggle');
    const chatBody = document.querySelector('.chat-body');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatOutput = document.getElementById('chat-output');
    const voiceInputBtn = document.getElementById('voice-input');
    const smartSuggestionButtons = document.querySelectorAll('.quick-reply');
    const rateUsBtn = document.querySelector('.feedback-option button');
    const shareLocationBtn = document.getElementById('share-location');
    const fileUpload = document.getElementById('file-upload');
    const fileUploadLabel = document.getElementById('file-upload-label');

    let recognition;
    let isRecognizing = false;

    // Initialize Speech Recognition (Web Speech API)
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isRecognizing = true;
            voiceInputBtn.innerText = '🔴 Listening...';
        };

        recognition.onend = () => {
            isRecognizing = false;
            voiceInputBtn.innerText = '🎤';
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            isRecognizing = false;
            voiceInputBtn.innerText = '🎤';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim();
            if (transcript) {
                displayMessage(transcript, 'user');
                botReply(transcript);
            }
        };
    } else {
        alert('Speech Recognition is not supported in this browser.');
    }

    // Toggle chatbot visibility
    chatToggle.addEventListener('click', () => {
        chatBody.classList.toggle('hidden');
    });

    // Send message
    sendBtn.addEventListener('click', () => {
        const userMessage = userInput.value.trim();
        if (userMessage) {
            displayMessage(userMessage, 'user');
            userInput.value = '';
            botReply(userMessage);
        }
    });

    // Handle quick replies
    smartSuggestionButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const userMessage = event.target.innerText;
            displayMessage(userMessage, 'user');
            botReply(userMessage);
        });
    });

    // Handle voice input button click
    voiceInputBtn.addEventListener('click', () => {
        if (isRecognizing) {
            recognition.stop(); // Stop recognition if already recognizing
        } else {
            recognition.start(); // Start speech recognition
        }
    });

    // Handle "Rate Us" feedback
    rateUsBtn.addEventListener('click', () => {
        alert('Thanks for rating us!');
    });

    // Handle location sharing
    shareLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const location = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
                displayMessage(location, 'user');
                botReply(`Location shared: ${location}`);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

    // Handle file upload click
    fileUploadLabel.addEventListener('click', () => {
        fileUpload.click();
    });

    // Handle file selection
    fileUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            displayMessage(`File uploaded: ${file.name}`, 'user');
            botReply('File received.');
        }
    });

    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(sender);
        messageElement.innerText = message;
        chatOutput.appendChild(messageElement);
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    function botReply(userMessage) {
        let botMessage = '';

        // Simple conversation flow based on user input
        const lowerCaseMessage = userMessage.toLowerCase();

        if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
            botMessage = 'Hello! How can I assist you today?';
        } else if (lowerCaseMessage.includes('file a complaint')) {
            botMessage = 'Please provide the details of your complaint.';
        } else if (lowerCaseMessage.includes('view complaint status')) {
            botMessage = 'You currently have no complaints. Let me know if you want to file a new one.';
        } else if (lowerCaseMessage.includes('get help')) {
            botMessage = 'You can reach support at support@municipality.com for further assistance.';
        } else if (lowerCaseMessage.includes('location')) {
            botMessage = 'Thanks for sharing your location!';
        } else if (lowerCaseMessage.includes('thank you') || lowerCaseMessage.includes('thanks')) {
            botMessage = 'You are welcome! If you need further assistance, feel free to ask.';
        } else if (lowerCaseMessage.includes('rate us')) {
            botMessage = 'Thank you for your feedback! We appreciate your rating.';
        } else {
            botMessage = 'I am not sure how to respond to that. Can you please clarify?';
        }

        displayMessage(botMessage, 'bot');
    }
});
