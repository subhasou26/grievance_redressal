document.addEventListener('DOMContentLoaded', function() {
    // Dark Mode functionality
    const themeSwitch = document.getElementById('theme-switch');
    const hamburgerThemeSwitch = document.getElementById('hamburger-theme-switch');
    document.getElementById('logout').addEventListener('click',function(){
        window.location.href='/api/auth/logout';
    })
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('change', toggleDarkMode);
    }

    if (hamburgerThemeSwitch) {
        hamburgerThemeSwitch.addEventListener('change', toggleDarkMode);
    }

    // Hamburger menu functionality
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const hamburgerMenu = document.getElementById('hamburger-menu');

    if (hamburgerIcon && hamburgerMenu) {
        hamburgerIcon.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('show');
        });
    }

    // Chatbot functionality
    const chatInput = document.getElementById('chat-input');
    const chatOutput = document.getElementById('chat-output');
    const toggleChatbot = document.getElementById('toggle-chatbot');
    const chatBody = document.querySelector('.chat-body');

    if (chatInput) {
        chatInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                const userInput = chatInput.value;
                chatInput.value = '';

                appendMessage('user', userInput);

                let botResponse;

                if (userInput.toLowerCase().includes('hello')) {
                    botResponse = 'Hello! How can I help you today?';
                } else if (userInput.toLowerCase().includes('complaint')) {
                    botResponse = 'You can file a complaint through the "Your Complaints" section.';
                } else {
                    botResponse = 'I am not sure how to respond to that.';
                }

                setTimeout(() => {
                    appendMessage('bot', botResponse);
                }, 1000);
            }
        });
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(sender);
        messageElement.textContent = message;
        chatOutput.appendChild(messageElement);
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    if (toggleChatbot) {
        toggleChatbot.addEventListener('click', function() {
            chatBody.classList.toggle('hidden');
        });
    }
    
});