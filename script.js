// Configuration Section
const config = {
    chatSpeedMin: 400, // Minimum chat message interval in milliseconds (1 second)
    chatSpeedMax: 1000, // Maximum chat message interval in milliseconds (4 seconds)
    maxMessagesDisplayed: 100, // Maximum number of messages displayed in the chat box before clearing
    chatBoxSelector: '#chat-box', // Chat box element selector
    usernamesInputSelector: '#usernames-input', // Usernames input selector
    messagesInputSelector: '#messages-input', // Messages input selector
    messageClass: 'message', // CSS class for chat messages
    notificationSelector: '#notification', // Notification box selector
    randomColors: ['#FF5733', '#3375FF', '#FF33B8', '#FFD433', '#33FFF2', '#A533FF'], // Array of random colors for usernames
    messageStyle: 'color: white;', // Style for chat messages
    allowedStickers: ['🔥', '😂', '👍', '💯', '🎉', '🤔'], // Allowed stickers in messages
};

let usernames = [];
let messages = [];
let chatInterval = null;

// Helper function to get random element from an array
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Function to bulk import usernames and messages
function bulkImport() {
    const usernamesInput = document.querySelector(config.usernamesInputSelector).value.trim();
    const messagesInput = document.querySelector(config.messagesInputSelector).value.trim();

    // Split input into arrays
    usernames = usernamesInput.split('\n').map(name => name.trim()).filter(Boolean);
    messages = messagesInput.split('\n').map(message => message.trim()).filter(Boolean);

    if (usernames.length === 0 || messages.length === 0) {
        alert("Please provide both usernames and messages.");
        return;
    }

    alert('Usernames and messages imported successfully!');
}

// Function to import messages from a text file
function importMessagesFromFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            messages = content.split('\n').map(msg => msg.trim()).filter(Boolean);
            alert('Messages imported from file!');
        };
        reader.readAsText(file);
    }
}

// Function to randomly select a username, message, and display it with random color and optional sticker
function addRandomMessage() {
    if (usernames.length === 0 || messages.length === 0) return;

    const randomUsername = getRandomElement(usernames);
    const randomMessage = getRandomElement(messages);
    const randomColor = getRandomElement(config.randomColors);

    // Add random sticker with a 30% chance
    let finalMessage = randomMessage;
    if (Math.random() < 0.3) {
        finalMessage += ' ' + getRandomElement(config.allowedStickers);
    }

    const chatBox = document.querySelector(config.chatBoxSelector);
    const newMessage = document.createElement('div');
    newMessage.classList.add(config.messageClass);
    newMessage.innerHTML = `<span style="color: ${randomColor}; font-weight: bold;">${randomUsername}:</span> <span style="${config.messageStyle}">${finalMessage}</span>`;
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll to the bottom

    // Remove old messages if over the limit
    const messagesInChat = chatBox.querySelectorAll(`.${config.messageClass}`);
    if (messagesInChat.length > config.maxMessagesDisplayed) {
        chatBox.removeChild(messagesInChat[0]);
    }
}

// Function to show notification when the chat starts
function showNotification(message) {
    const notificationBox = document.querySelector(config.notificationSelector);
    notificationBox.innerText = message;
    notificationBox.style.display = 'block'; // Show notification
    setTimeout(() => {
        notificationBox.style.display = 'none'; // Hide after 3 seconds
    }, 3000);
}

// Function to start the random chat loop
function startChat() {
    if (chatInterval) clearInterval(chatInterval); // Clear any existing interval

    showNotification('Chat has started!'); // Show start chat notification

    chatInterval = setInterval(() => {
        addRandomMessage();
    }, Math.floor(Math.random() * (config.chatSpeedMax - config.chatSpeedMin)) + config.chatSpeedMin);
}
