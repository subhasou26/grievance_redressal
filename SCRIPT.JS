document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');
    const chatToggle = document.getElementById('chat-toggle');
    const chatBody = document.querySelector('.chat-body');
    const darkModeSwitch = document.getElementById('dark-mode');
    const body = document.body;
    const smartSuggestionButtons = document.querySelectorAll('.quick-reply');

    // Toggle Sidebar Menu
    let sidebarOpen = false; // Track if the sidebar is open or not
    hamburgerMenu.addEventListener('click', () => {
        if (sidebarOpen) {
            sidebar.style.width = '0';
            sidebarOpen = false;
        } else {
            sidebar.style.width = '250px';
            sidebarOpen = true;
        }
    });

    // Close the sidebar if clicked outside of it
    document.addEventListener('click', (event) => {
        if (sidebarOpen && !sidebar.contains(event.target) && event.target !== hamburgerMenu) {
            sidebar.style.width = '0';
            sidebarOpen = false;
        }
    });

    // Toggle Chatbox visibility
    chatToggle.addEventListener('click', () => {
        chatBody.classList.toggle('hidden');
    });

    // Dark Mode Toggle
    darkModeSwitch.addEventListener('change', () => {
        if (darkModeSwitch.checked) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    });

    // Chatbot logic
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatOutput = document.getElementById('chat-output');
    const voiceInputBtn = document.getElementById('voice-input');

    // Handle sending message
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Handle smart suggestions (quick replies)
    smartSuggestionButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const suggestion = event.target.textContent;
            appendMessage('user', suggestion);
            handleBotReply(suggestion);
        });
    });

    // Voice input (Speech recognition)
    voiceInputBtn.addEventListener('click', () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.start();
        recognition.onresult = function(event) {
            const speechToText = event.results[0][0].transcript;
            appendMessage('user', speechToText);
            handleBotReply(speechToText);
        };
    });

    // Send message function
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            appendMessage('user', message);
            handleBotReply(message);
            userInput.value = '';
        }
    }

    // Append message to chat
    function appendMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(sender);
        messageDiv.textContent = message;
        chatOutput.appendChild(messageDiv);
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    // Bot reply logic
    function handleBotReply(userMessage) {
        let botReply = 'I am not sure how to respond.';

        if (userMessage.toLowerCase().includes('file a complaint')) {
            botReply = 'Please provide the details of your complaint.';
        } else if (userMessage.toLowerCase().includes('view complaint status')) {
            botReply = 'You have no complaints at the moment.';
        } else if (userMessage.toLowerCase().includes('get help')) {
            botReply = 'You can reach support at support@municipality.com.';
        }

        appendMessage('bot', botReply);
    }
});
