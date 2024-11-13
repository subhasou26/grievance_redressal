document.addEventListener('DOMContentLoaded', () => {
    const grievances = complaints;
    console.log(grievances);

   
    const totalRegisteredElement = document.getElementById('total-registered');
    const pendingGrievancesElement = document.getElementById('pending-grievances');
    const closedGrievancesElement = document.getElementById('closed-grievances');


    function updateStatistics(grievances) {
        const totalRegistered = grievances.length;
        const pendingGrievances = grievances.filter(grievance => grievance.status.toLowerCase() === 'pending').length;
        const closedGrievances = grievances.filter(grievance => grievance.status.toLowerCase() === 'Resolved').length;

        totalRegisteredElement.textContent = totalRegistered;
        pendingGrievancesElement.textContent = pendingGrievances;
        closedGrievancesElement.textContent = closedGrievances;
    }

   // displayGrievances(grievances);

    updateStatistics(grievances);

    window.searchGrievance = function() {
        const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
        const filteredGrievances = grievances.filter(grievance => 
            grievance.complaintNumber.toLowerCase().includes(searchInput)
        );
        
        updateStatistics(filteredGrievances); 
    };
    document.getElementById("lunch_complaint").addEventListener('click',function (event){
        window.location.href='/api/complaint';
    })
    document.getElementById("sign-out").addEventListener('click',function(){
        window.location.href='/api/auth/logout';
    })
});

document.addEventListener("DOMContentLoaded", function() {
    const complaintRows = document.querySelectorAll("#complaints-table-body tr");
    const modal = document.getElementById("complaint-modal");
    const modalClose = document.getElementById("modal-close");
    const complaintNumberElem = document.getElementById("modal-complaint-number");
    const descriptionElem = document.getElementById("modal-description");
    const statusElem = document.getElementById("modal-status");
    const responceElam=document.getElementById("modal-responce");
   

    // Function to open the modal and populate it with complaint details
    complaintRows.forEach(row => {
        row.addEventListener("click", function() {
            const complaintNumber = this.querySelector("td:nth-child(1)").innerText;
            const description = this.querySelector("td:nth-child(2)").innerText;
            const status = this.querySelector("td:nth-child(3)").innerText;
            const responce=this.querySelector("td:nth-child(4)").innerText;
            // Set selected complaint id (this would come from your server in a real app)
            
            // Populate modal with complaint details
            complaintNumberElem.innerText = complaintNumber;
            descriptionElem.innerText = description;
            statusElem.innerText = status;
            responceElam.innerText=responce;
            // Show the modal
            modal.style.display = "block";
        });
    });

    // Close the modal
    modalClose.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Submit solution to update complaint
   
});
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
    let complaintDetails = {}; // Object to hold complaint details

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
                complaintDetails.location = location; // Add location to complaint details
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
            complaintDetails.file = file.name; // Add file name to complaint details
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
            initiateComplaint(); // Initiate complaint process
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
        } else if (lowerCaseMessage.includes('submit complaint')) {
            submitComplaint(); // Submit the complaint
            botMessage = 'Your complaint has been submitted successfully.';
        } else {
            botMessage = 'I am not sure how to respond to that. Can you please clarify?';
        }

        displayMessage(botMessage, 'bot');
    }

    function initiateComplaint() {
        // Function to start gathering complaint details
        botReply('Please describe the issue you are facing.');
    }

    function submitComplaint() {
        // Function to structure the complaint as a JSON object and simulate posting it
        const complaintJson = JSON.stringify(complaintDetails, null, 2);
        console.log('Complaint JSON:', complaintJson);

        // Simulate posting to a database
        postToDatabase(complaintJson);
    }

    function postToDatabase(data) {
        // Simulate an API call to post data to a database
        console.log('Posting to database:', data);
        alert('Complaint has been posted to the database (simulated).');
    }
});
