// Messages storage (in real app, this would be in a database)
let messages = [];
let selectedGesture = null;

// 7 Day Letters storage - these will be blank initially
let dayLetters = {
    day1: "",
    day2: "",
    day3: "",
    day4: "",
    day5: "",
    day6: "",
    day7: ""
};

// DOM Elements
let contentSection;

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    contentSection = document.getElementById('contentSection');
    
    // Set romantic title and message
    const title = document.getElementById('personalizedTitle');
    const message = document.getElementById('personalizedMessage');
    if (title) title.textContent = 'Happy National Girlfriend Day!';
    if (message) message.textContent = "Here are 7 letters for each day we're apart. I'll fill them in soon. I love you!";
    
    // Load messages on page load
    loadMessages();
});

// Login function
function handleLogin(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();
    
    console.log('Login attempt:', username, password); // Debug log
    console.log('Available users:', Object.keys(users)); // Debug log
    
    if (users[username] && users[username].password === password) {
        currentUser = users[username];
        console.log('Login successful for:', currentUser.name); // Debug log
        
        // Show success message
        showLoginSuccess();
        
        // Clear form
        usernameInput.value = '';
        passwordInput.value = '';
        
        // Transition to dashboard after success message
        setTimeout(() => {
            console.log('About to call showDashboard'); // Debug log
            console.log('loginPage element:', loginPage); // Debug log
            console.log('dashboardPage element:', dashboardPage); // Debug log
            showDashboard();
            console.log('showDashboard called'); // Debug log
        }, 1500);
        
    } else {
        console.log('Login failed - invalid credentials'); // Debug log
        // Show error animation
        showLoginError();
    }
}

// Show login success message
function showLoginSuccess() {
    // Create success message
    let successMsg = document.querySelector('.success-message');
    if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #6c63ff 0%, #5a52d5 100%);
            color: white;
            padding: 2rem 3rem;
            border-radius: 15px;
            text-align: center;
            font-size: 1.2rem;
            font-weight: 600;
            box-shadow: 0 20px 40px rgba(108, 99, 255, 0.3);
            z-index: 1000;
            opacity: 0;
            animation: successPop 1.5s ease-out forwards;
        `;
        document.body.appendChild(successMsg);
    }
    
    successMsg.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
        Login Successful!<br>
        <span style="font-size: 1rem; opacity: 0.9;">Welcome to your love space</span>
    `;
    
    // Remove success message after animation
    setTimeout(() => {
        if (successMsg) {
            successMsg.remove();
        }
    }, 2000);
}

// Show login error
function showLoginError() {
    loginForm.style.animation = 'shake 0.5s ease-in-out';
    
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
            background: rgba(231, 76, 60, 0.1);
            padding: 0.8rem;
            border-radius: 8px;
            border: 1px solid rgba(231, 76, 60, 0.3);
        `;
        loginForm.appendChild(errorMsg);
    }
    
    errorMsg.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Incorrect username or password';
    errorMsg.style.opacity = '1';
    
    // Clear error after 3 seconds
    setTimeout(() => {
        loginForm.style.animation = '';
        if (errorMsg) {
            errorMsg.style.opacity = '0';
            setTimeout(() => errorMsg.remove(), 300);
        }
    }, 3000);
    
    // Clear form
    usernameInput.value = '';
    passwordInput.value = '';
}

// Show dashboard with personalized content
function showDashboard() {
    console.log('showDashboard called'); // Debug log
    console.log('loginPage classes before:', loginPage.classList.toString());
    console.log('dashboardPage classes before:', dashboardPage.classList.toString());
    
    if (!loginPage || !dashboardPage) {
        console.error('Page elements not found:', { loginPage, dashboardPage });
        return;
    }
    
    const currentUsername = currentUser === users.boyfriend ? 'boyfriend' : 'girlfriend';
    const userInitial = currentUsername.charAt(0).toUpperCase();
    
    // Update user info in navbar
    if (welcomeUser) welcomeUser.textContent = `${currentUser.name}`;
    if (userAvatar) userAvatar.textContent = userInitial;
    
    // Update hero section
    if (personalizedTitle) personalizedTitle.textContent = currentUser.personalizedTitle;
    if (personalizedMessage) personalizedMessage.textContent = currentUser.personalizedMessage;
    
    // Hide content section initially
    if (contentSection) contentSection.classList.add('hidden');
    
    console.log('Switching from login to dashboard'); // Debug log
    
    // Force immediate switch - remove active from login, add to dashboard
    loginPage.classList.remove('active');
    dashboardPage.classList.add('active');
    
    console.log('loginPage classes after:', loginPage.classList.toString());
    console.log('dashboardPage classes after:', dashboardPage.classList.toString());
    console.log('Dashboard should now be visible'); // Debug log
    
    // Load messages after dashboard is shown
    setTimeout(() => {
        loadMessages();
    }, 100);
}

// Logout function
function handleLogout() {
    currentUser = null;
    
    // Smooth transition from dashboard to login
    dashboardPage.style.opacity = '0';
    dashboardPage.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        dashboardPage.classList.remove('active');
        loginPage.classList.add('active');
        contentSection.classList.add('hidden');
        
        // Animate login page entrance
        loginPage.style.opacity = '0';
        loginPage.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            loginPage.style.opacity = '1';
            loginPage.style.transform = 'scale(1)';
        }, 100);
        
        // Reset dashboard styles
        setTimeout(() => {
            dashboardPage.style.opacity = '';
            dashboardPage.style.transform = '';
        }, 500);
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
                ${renderMessages()}
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
    try {
        const response = await fetch('/api/messages');
        const data = await response.json();
        if (data.success) {
            messages = data.messages;
            
            // Re-render messages
            const messagesList = document.getElementById('messagesList');
            if (messagesList) {
                messagesList.innerHTML = renderMessages();
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
    
    const messageData = {
        sender: 'anonymous',
        senderName: 'Anonymous',
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
                    messagesList.innerHTML = renderMessages();
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
function renderMessages() {
    if (messages.length === 0) {
        return '<div class="no-messages">No messages yet. Be the first to send a sweet message!</div>';
    }
    
    return messages.map(message => {
        const hasGesture = message.gesture ? 'has-gesture' : '';
        
        let gestureHtml = '';
        if (message.gesture === 'kiss') {
            gestureHtml = `<div class="message-gesture kiss"><span class="gesture-animation">💋</span> Sent you a virtual kiss!</div>`;
        } else if (message.gesture === 'hug') {
            gestureHtml = `<div class="message-gesture hug"><span class="gesture-animation">🤗</span> Sent you a virtual hug!</div>`;
        }
        
        return `
            <div class="message-item ${hasGesture}">
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

// Load messages on page initialization
async function loadMessages() {
    try {
        const response = await fetch('/api/messages');
        const data = await response.json();
        if (data.success) {
            messages = data.messages;
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        // Continue without messages if server is not available
    }
}

// Show the 7 day letters
function showLetters() {
    const content = `
        <div class="letters-section">
            <h2>7 Letters for You</h2>
            <p style="text-align: center; color: #7f8c8d; margin-bottom: 2rem;">
                One letter for each day we're apart. I'll fill them with love soon.
            </p>
            <div class="letters-list">
                <div class="letter-card" id="letter1">
                    <div class="letter-header">
                        <i class="fas fa-heart"></i>
                        <h3>Day 1</h3>
                    </div>
                    <div class="letter-content">
                        <p class="letter-placeholder">This letter will be filled with love for you soon...</p>
                    </div>
                </div>
                <div class="letter-card" id="letter2">
                    <div class="letter-header">
                        <i class="fas fa-heart"></i>
                        <h3>Day 2</h3>
                    </div>
                    <div class="letter-content">
                        <p class="letter-placeholder">This letter will be filled with love for you soon...</p>
                    </div>
                </div>
                <div class="letter-card" id="letter3">
                    <div class="letter-header">
                        <i class="fas fa-heart"></i>
                        <h3>Day 3</h3>
                    </div>
                    <div class="letter-content">
                        <p class="letter-placeholder">This letter will be filled with love for you soon...</p>
                    </div>
                </div>
                <div class="letter-card" id="letter4">
                    <div class="letter-header">
                        <i class="fas fa-heart"></i>
                        <h3>Day 4</h3>
                    </div>
                    <div class="letter-content">
                        <p class="letter-placeholder">This letter will be filled with love for you soon...</p>
                    </div>
                </div>
                <div class="letter-card" id="letter5">
                    <div class="letter-header">
                        <i class="fas fa-heart"></i>
                        <h3>Day 5</h3>
                    </div>
                    <div class="letter-content">
                        <p class="letter-placeholder">This letter will be filled with love for you soon...</p>
                    </div>
                </div>
                <div class="letter-card" id="letter6">
                    <div class="letter-header">
                        <i class="fas fa-heart"></i>
                        <h3>Day 6</h3>
                    </div>
                    <div class="letter-content">
                        <p class="letter-placeholder">This letter will be filled with love for you soon...</p>
                    </div>
                </div>
                <div class="letter-card" id="letter7">
                    <div class="letter-header">
                        <i class="fas fa-heart"></i>
                        <h3>Day 7</h3>
                    </div>
                    <div class="letter-content">
                        <p class="letter-placeholder">This letter will be filled with love for you soon...</p>
                    </div>
                </div>
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
