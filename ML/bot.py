import json

# Function to check for "cancel" in user input
def check_cancel(user_response):
    if "cancel" in user_response.lower():
        print("Bot: Complaint process canceled. Would you like any other help?")
        return True
    return False

# Function to gather complaint details
def gather_complaint_details():
    complaint_details = {}

    # Ask for complaint heading
    user_response = input("Bot: Complaint heading? ")
    if check_cancel(user_response):
        return None  # Exit if "cancel" is detected
    complaint_details["heading"] = user_response

    # Ask for complaint tag
    user_response = input("Bot: Complaint tag (water, road, electricity, garbage)? ")
    if check_cancel(user_response):
        return None  # Exit if "cancel" is detected
    complaint_details["tag"] = user_response

    # Ask for complaint address
    user_response = input("Bot: Complaint address with pincode? ")
    if check_cancel(user_response):
        return None  # Exit if "cancel" is detected
    complaint_details["address"] = user_response

    # Ask for complaint authority
    user_response = input("Bot: Complaint submitted to which authority? ")
    if check_cancel(user_response):
        return None  # Exit if "cancel" is detected
    complaint_details["authority"] = user_response

    return complaint_details

# Main function to run the chatbot
def grievance_bot():
    print("Bot: Hello! How may I assist you today?")

    while True:
        user_input = input("User: ")
        intent = detect_intent(user_input)

        if intent == "greeting":
            print("Bot: Hello! How may I help you?")
        elif intent == "gratitude":
            print("Bot: I’m glad to help. Feel free to ask for further assistance!")
        elif intent == "lodge_complaint":
            complaint_details = gather_complaint_details()

            # Stop if complaint process was canceled
            if complaint_details is None:
                continue  # Continue the loop and prompt user again

            # Confirm submission if complaint details were successfully gathered
            final_confirm = input("Bot: Finalise complaint? (yes/no) ").lower()
            if check_cancel(final_confirm):
                continue  # Continue the loop and prompt user again
            elif final_confirm == "yes":
                complaint_json = {
                    "user_id": "example_user_id",
                    **complaint_details
                }
                with open("/content/complaint.json", "w") as f:
                    json.dump(complaint_json, f, indent=4)
                print("Bot: Complaint has been submitted. JSON file created.")
                print("Complaint JSON:", complaint_json)
        elif intent == "cancel":
            print("Bot: Complaint process canceled. Would you like any other help?")
            continue  # Continue the loop and prompt user again
        else:
            print("Bot: I’m sorry, I did not get that. Could you please clarify?")

# Intent detection function for handling different user inputs
def detect_intent(user_input):
    user_input = user_input.lower()
    if any(word in user_input for word in ["hello", "hi"]):
        return "greeting"
    elif "thank" in user_input or "done" in user_input:
        return "gratitude"
    elif "lodge a complaint" in user_input or "issue a complaint" in user_input or "lodge complaint" in user_input or "issue complaint" in user_input:
        return "lodge_complaint"
    elif "cancel" in user_input:
        return "cancel"
    else:
        return "unknown"

# Run the bot
grievance_bot()