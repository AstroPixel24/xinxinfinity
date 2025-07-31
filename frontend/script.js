// User credentials - You can customize these
const users = {
    'boyfriend': {
        password: 'iloveyou',
        name: 'My Wonderful Boyfriend',
        personalizedTitle: 'Thank you for being the best boyfriend ever!',
        personalizedMessage: 'Today we celebrate not just National Girlfriend Day, but our beautiful love story that grows stronger every day.',
        loveNotes: [
            "Every day with you feels like a dream come true. Thank you for being my rock, my sunshine, and my best friend all in one.",
            "You make me laugh when I want to cry, you hold me close when I need comfort, and you believe in me when I doubt myself.",
            "Our love story is my favorite story to tell. Thank you for writing it with me, page by page, day by day.",
            "You're not just my boyfriend, you're my person, my home, and my forever. I love you more than words can express."
        ],
        surprises: [
            "A virtual hug that lasts forever - consider yourself hugged right now!",
            "You're getting a surprise date night planned by me very soon!",
            "I wrote you a love letter - check your messages later today!",
            "I made you a playlist of songs that remind me of us!"
        ]
    },
    'girlfriend': {
        password: 'youremine',
        name: 'My Beautiful Girlfriend',
        personalizedTitle: 'Happy National Girlfriend Day to the most amazing woman!',
        personalizedMessage: 'You light up my world in ways I never thought possible. Today and every day, I celebrate you.',
        loveNotes: [
            "Your smile is the first thing I think about when I wake up and the last thing I see before I sleep. You're my everything.",
            "Thank you for being patient with me, for loving me unconditionally, and for making every ordinary moment extraordinary.",
            "You're not just beautiful on the outside - your heart, your mind, your soul - everything about you is absolutely perfect.",
            "I fall in love with you more and more each day. You're my queen, my heart, and my forever."
        ],
        surprises: [
            "Fresh flowers are coming your way this week - your favorite ones!",
            "I got your favorite chocolates hidden somewhere special for you to find!",
            "Planning a surprise romantic evening just for us - dress comfy!",
            "You deserve to be spoiled today and every day - you're my princess!"
        ]
    }
};

// Special dates for both users
const specialDates = [
    {
        date: "First Date",
        description: "The day our beautiful journey began. I knew you were special from that very first moment."
    },
    {
        date: "First Kiss",
        description: "When time stood still and I knew I was falling for you completely. That magical moment is still vivid in my heart."
    },
    {
        date: "First 'I Love You'",
        description: "The day we opened our hearts completely to each other. Those three words changed everything."
    },
    {
        date: "National Girlfriend Day 2025",
        description: "Today! A day to celebrate the incredible woman who makes my life complete. You deserve all the love in the world."
    }
];

// Messages storage (in real app, this would be in a database)
let messages = [];
let selectedGesture = null;

let currentUser = null;

// DOM Elements
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const welcomeUser = document.getElementById('welcomeUser');
const personalizedTitle = document.getElementById('personalizedTitle');
const personalizedMessage = document.getElementById('personalizedMessage');
const logoutBtn = document.getElementById('logoutBtn');
const contentSection = document.getElementById('contentSection');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);

// Login function
function handleLogin(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();
    
    if (users[username] && users[username].password === password) {
        currentUser = users[username];
        showDashboard();
        
        // Add login success animation
        loginPage.style.transform = 'scale(0.95)';
        loginPage.style.opacity = '0';
        
        setTimeout(() => {
            loginPage.classList.remove('active');
            dashboardPage.classList.add('active');
            
            // Reset login page styles
            setTimeout(() => {
                loginPage.style.transform = '';
                loginPage.style.opacity = '';
            }, 500);
        }, 300);
    } else {
        // Show error animation
        loginForm.style.animation = 'shake 0.5s ease-in-out';
        loginForm.style.borderColor = '#e74c3c';
        
        // Create error message
        let errorMsg = document.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = `
                color: #e74c3c;
                text-align: center;
                margin-top: 1rem;
                font-size: 0.9rem;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            loginForm.appendChild(errorMsg);
        }
        
        errorMsg.textContent = 'Oops! Check your username and password';
        errorMsg.style.opacity = '1';
        
        // Clear error after 3 seconds
        setTimeout(() => {
            loginForm.style.animation = '';
            loginForm.style.borderColor = '';
            errorMsg.style.opacity = '0';
        }, 3000);
    }
    
    // Clear form
    usernameInput.value = '';
    passwordInput.value = '';
}

// Show dashboard with personalized content
function showDashboard() {
    welcomeUser.textContent = `Welcome, ${currentUser.name}!`;
    personalizedTitle.textContent = currentUser.personalizedTitle;
    personalizedMessage.textContent = currentUser.personalizedMessage;
    
    // Hide content section initially
    contentSection.classList.add('hidden');
}

// Logout function
function handleLogout() {
    currentUser = null;
    dashboardPage.classList.remove('active');
    loginPage.classList.add('active');
    contentSection.classList.add('hidden');
    
    // Add logout animation
    dashboardPage.style.transform = 'translateY(-20px)';
    dashboardPage.style.opacity = '0';
    
    setTimeout(() => {
        dashboardPage.style.transform = '';
        dashboardPage.style.opacity = '';
    }, 300);
}

// Show love notes
function showLoveNotes() {
    const content = `
        <h2>Love Notes Just For You</h2>
        ${currentUser.loveNotes.map(note => `
            <div class="love-note">
                <i class="fas fa-heart" style="color: #6c63ff; margin-right: 0.5rem;"></i>
                ${note}
            </div>
        `).join('')}
        <div style="text-align: center; margin-top: 2rem;">
            <button class="feature-btn" onclick="hideContent()">
                <i class="fas fa-arrow-left"></i> Back to Main
            </button>
        </div>
    `;
    
    showContent(content);
}

// Show messages
async function showMessages() {
    const currentUsername = currentUser === users.boyfriend ? 'boyfriend' : 'girlfriend';
    
    // Fetch messages from server
    try {
        const response = await fetch('/api/messages');
        const data = await response.json();
        if (data.success) {
            messages = data.messages;
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
    
    const content = `
        <div class="messages-section">
            <h2>Our Messages</h2>
            
            <div class="message-input-container">
                <h3>Send a Message</h3>
                <form class="message-form" onsubmit="sendMessage(event)">
                    <div class="gesture-buttons">
                        <button type="button" class="gesture-btn" onclick="selectGesture('kiss')" id="kissBtn">
                            💋 Virtual Kiss
                        </button>
                        <button type="button" class="gesture-btn" onclick="selectGesture('hug')" id="hugBtn">
                            🤗 Virtual Hug
                        </button>
                        <button type="button" class="gesture-btn" onclick="selectGesture(null)" id="normalBtn">
                            💬 Just Message
                        </button>
                    </div>
                    <textarea 
                        class="message-input" 
                        id="messageInput" 
                        placeholder="Write something sweet..."
                        required
                    ></textarea>
                    <button type="submit" class="send-message-btn">
                        <i class="fas fa-paper-plane"></i> Send Message
                    </button>
                </form>
            </div>
            
            <div class="messages-list" id="messagesList">
                ${renderMessages(currentUsername)}
            </div>
            
            <div style="text-align: center; margin-top: 1rem;">
                <button class="feature-btn" onclick="refreshMessages()" style="background: rgba(108, 99, 255, 0.1); color: #6c63ff; margin-right: 1rem;">
                    <i class="fas fa-sync-alt"></i> Refresh Messages
                </button>
            </div>
            
            <div style="text-align: center; margin-top: 2rem;">
                <button class="feature-btn" onclick="hideContent()">
                    <i class="fas fa-arrow-left"></i> Back to Main
                </button>
            </div>
        </div>
    `;
    
    showContent(content);
}

// Select gesture function
function selectGesture(gesture) {
    selectedGesture = gesture;
    
    // Update button states
    document.querySelectorAll('.gesture-btn').forEach(btn => btn.classList.remove('active'));
    
    if (gesture === 'kiss') {
        document.getElementById('kissBtn').classList.add('active');
    } else if (gesture === 'hug') {
        document.getElementById('hugBtn').classList.add('active');
    } else {
        document.getElementById('normalBtn').classList.add('active');
    }
}

// Refresh messages function
async function refreshMessages() {
    const currentUsername = currentUser === users.boyfriend ? 'boyfriend' : 'girlfriend';
    
    try {
        const response = await fetch('/api/messages');
        const data = await response.json();
        if (data.success) {
            messages = data.messages;
            
            // Re-render messages
            const messagesList = document.getElementById('messagesList');
            if (messagesList) {
                messagesList.innerHTML = renderMessages(currentUsername);
            }
        }
    } catch (error) {
        console.error('Error refreshing messages:', error);
    }
}

// Send message function
async function sendMessage(event) {
    event.preventDefault();
    
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    
    if (!messageText) return;
    
    const currentUsername = currentUser === users.boyfriend ? 'boyfriend' : 'girlfriend';
    const senderName = currentUser.name;
    
    const messageData = {
        sender: currentUsername,
        senderName: senderName,
        content: messageText,
        gesture: selectedGesture
    };
    
    try {
        // Send message to server
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Clear input and reset gesture
            messageInput.value = '';
            selectedGesture = null;
            document.querySelectorAll('.gesture-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('normalBtn').classList.add('active');
            
            // Refresh messages from server
            const messagesResponse = await fetch('/api/messages');
            const messagesData = await messagesResponse.json();
            if (messagesData.success) {
                messages = messagesData.messages;
                
                // Re-render messages
                const messagesList = document.getElementById('messagesList');
                if (messagesList) {
                    messagesList.innerHTML = renderMessages(currentUsername);
                }
                
                // Scroll to top to see the new message
                messagesList.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            alert('Failed to send message. Please try again.');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please check your connection.');
    }
}

// Render messages function
function renderMessages(currentUsername) {
    if (messages.length === 0) {
        return '<div class="no-messages">No messages yet. Be the first to send a sweet message!</div>';
    }
    
    return messages.map(message => {
        const isMyMessage = message.sender === currentUsername;
        const messageClass = isMyMessage ? 'sent-by-me' : 'sent-by-partner';
        const hasGesture = message.gesture ? 'has-gesture' : '';
        
        let gestureHtml = '';
        if (message.gesture === 'kiss') {
            gestureHtml = `<div class="message-gesture kiss"><span class="gesture-animation">💋</span> Sent you a virtual kiss!</div>`;
        } else if (message.gesture === 'hug') {
            gestureHtml = `<div class="message-gesture hug"><span class="gesture-animation">🤗</span> Sent you a virtual hug!</div>`;
        }
        
        return `
            <div class="message-item ${messageClass} ${hasGesture}">
                <div class="message-header">
                    <span class="message-sender">${message.senderName}</span>
                    <span class="message-time">${message.dateFormatted}</span>
                </div>
                ${gestureHtml}
                <div class="message-content">${message.content}</div>
            </div>
        `;
    }).join('');
}

// Show memory gallery
function showGallery() {
    const memories = [
        { icon: 'fas fa-camera', title: 'First Photo Together' },
        { icon: 'fas fa-heart', title: 'Our First Date' },
        { icon: 'fas fa-star', title: 'Anniversary' },
        { icon: 'fas fa-gift', title: 'Birthday Surprise' },
        { icon: 'fas fa-plane', title: 'Our First Trip' },
        { icon: 'fas fa-home', title: 'Moving In Together' },
        { icon: 'fas fa-ring', title: 'Promise Ring' },
        { icon: 'fas fa-coffee', title: 'Morning Coffee Dates' },
        { icon: 'fas fa-moon', title: 'Stargazing Nights' }
    ];
    
    const content = `
        <h2>Our Memory Gallery</h2>
        <p style="text-align: center; color: #7f8c8d; margin-bottom: 2rem;">
            Every moment with you becomes a treasured memory
        </p>
        <div class="memory-gallery">
            ${memories.map(memory => `
                <div class="memory-item" title="${memory.title}">
                    <i class="${memory.icon}"></i>
                </div>
            `).join('')}
        </div>
        <div style="text-align: center; margin-top: 2rem;">
            <p style="color: #6c63ff; font-style: italic;">
                Tip: Each photo represents a special moment in our journey together!
            </p>
            <button class="feature-btn" onclick="hideContent()" style="margin-top: 1rem;">
                <i class="fas fa-arrow-left"></i> Back to Main
            </button>
        </div>
    `;
    
    showContent(content);
}

// Show special dates
function showDates() {
    const content = `
        <h2>Our Special Milestones</h2>
        <p style="text-align: center; color: #7f8c8d; margin-bottom: 2rem;">
            Important moments that shaped our beautiful love story
        </p>
        ${specialDates.map(date => `
            <div class="special-date">
                <h4><i class="fas fa-calendar-heart"></i> ${date.date}</h4>
                <p>${date.description}</p>
            </div>
        `).join('')}
        <div style="text-align: center; margin-top: 2rem;">
            <button class="feature-btn" onclick="hideContent()">
                <i class="fas fa-arrow-left"></i> Back to Main
            </button>
        </div>
    `;
    
    showContent(content);
}

// Show surprises
function showSurprises() {
    const content = `
        <div class="surprise-box">
            <div class="gift-icon">
                <i class="fas fa-gift"></i>
            </div>
            <h2>Surprise Box</h2>
            <p class="surprise-message">
                I've prepared some special surprises just for you! 
                Each one is a little token of my love and appreciation for everything you do.
            </p>
            
            <div style="text-align: left; max-width: 500px; margin: 2rem auto;">
                ${currentUser.surprises.map((surprise, index) => `
                    <div class="love-note" style="margin-bottom: 1rem; animation: fadeInUp 0.5s ease ${index * 0.2}s both;">
                        ${surprise}
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 2rem;">
                <p style="color: #6c63ff; font-weight: 500;">
                    More surprises coming soon... I love spoiling you!
                </p>
                <button class="feature-btn" onclick="hideContent()" style="margin-top: 1rem;">
                    <i class="fas fa-arrow-left"></i> Back to Main
                </button>
            </div>
        </div>
    `;
    
    showContent(content);
}

// Utility functions
function showContent(content) {
    contentSection.innerHTML = content;
    contentSection.classList.remove('hidden');
    contentSection.scrollIntoView({ behavior: 'smooth' });
}

function hideContent() {
    contentSection.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Add some interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Subtle click effect (removed excessive hearts)
    console.log('National Girlfriend Day website loaded with love!');
    
    // Initialize gesture selection to normal message
    selectedGesture = null;
});
