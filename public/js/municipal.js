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
document.addEventListener("DOMContentLoaded", function() {
    const complaintRows = document.querySelectorAll("#complaints-table-body tr");
    const modal = document.getElementById("complaint-modal");
    const modalClose = document.getElementById("modal-close");
    const complaintNumberElem = document.getElementById("modal-complaint-number");
    const descriptionElem = document.getElementById("modal-description");
    const statusElem = document.getElementById("modal-status");
    const submitSolutionBtn = document.getElementById("submit-solution");
    let selectedComplaintId;

    // Function to open the modal and populate it with complaint details
    complaintRows.forEach(row => {
        row.addEventListener("click", function() {
            const complaintNumber = this.querySelector("td:nth-child(1)").innerText;
            const description = this.querySelector("td:nth-child(2)").innerText;
            const status = this.querySelector("td:nth-child(3)").innerText;
            
            // Set selected complaint id (this would come from your server in a real app)
            selectedComplaintId = complaintNumber;
            console.log(selectedComplaintId);
            // Populate modal with complaint details
            complaintNumberElem.innerText = complaintNumber;
            descriptionElem.innerText = description;
            statusElem.innerText = status;

            // Show the modal
            modal.style.display = "block";
        });
    });

    // Close the modal
    modalClose.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Submit solution to update complaint
    submitSolutionBtn.addEventListener("click", function() {
        const solution = document.getElementById("solution-text").value;
        const status = "Resolved"; // Assuming when solution is provided, status is "Resolved"

        // PUT request to update complaint
        fetch(`/api/complaint/${selectedComplaintId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: status,
                response: solution,
                updatedAt: new Date()
            })
        })
        .then(response => response.json())
        .then(data => {
            alert("Complaint updated successfully!");
            modal.style.display = "none";

            // Optionally, refresh the page or update the complaint table
            location.reload();
        })
        .catch(error => {
            console.error("Error updating complaint:", error);
        });
    });
});