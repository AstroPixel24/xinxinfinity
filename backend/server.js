const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// User credentials - matches frontend
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

// Special dates
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

// Messages storage (in production, use a proper database)
let messages = [];

// Routes

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }
    
    const user = users[username.toLowerCase()];
    
    if (user && user.password === password) {
        // Remove password from response for security
        const { password: _, ...userResponse } = user;
        
        res.json({
            success: true,
            message: 'Login successful',
            user: {
                username: username.toLowerCase(),
                ...userResponse
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid username or password'
        });
    }
});

// Get user data
app.get('/api/user/:username', (req, res) => {
    const username = req.params.username.toLowerCase();
    const user = users[username];
    
    if (user) {
        const { password: _, ...userResponse } = user;
        res.json({
            success: true,
            user: {
                username,
                ...userResponse
            }
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
});

// Get special dates
app.get('/api/special-dates', (req, res) => {
    res.json({
        success: true,
        dates: specialDates
    });
});

// Love notes endpoint
app.get('/api/love-notes/:username', (req, res) => {
    const username = req.params.username.toLowerCase();
    const user = users[username];
    
    if (user && user.loveNotes) {
        res.json({
            success: true,
            notes: user.loveNotes
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Love notes not found'
        });
    }
});

// Surprises endpoint
app.get('/api/surprises/:username', (req, res) => {
    const username = req.params.username.toLowerCase();
    const user = users[username];
    
    if (user && user.surprises) {
        res.json({
            success: true,
            surprises: user.surprises
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Surprises not found'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running with love!',
        timestamp: new Date().toISOString()
    });
});

// Messages endpoints
app.get('/api/messages', (req, res) => {
    res.json({
        success: true,
        messages: messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    });
});

app.post('/api/messages', (req, res) => {
    const { sender, senderName, content, gesture } = req.body;
    
    if (!sender || !senderName || !content) {
        return res.status(400).json({
            success: false,
            message: 'Sender, senderName, and content are required'
        });
    }
    
    const newMessage = {
        id: Date.now(),
        sender,
        senderName,
        content,
        gesture: gesture || null,
        timestamp: new Date().toISOString(),
        dateFormatted: new Date().toLocaleString()
    };
    
    messages.push(newMessage);
    
    res.json({
        success: true,
        message: 'Message sent successfully',
        data: newMessage
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Catch all handler - serve index.html for any other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong on our server! 💔'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
    National Girlfriend Day Website is running!
    
    Server: http://localhost:${PORT}
    Ready to spread love!
    
    Login Credentials:
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Boyfriend:
       Username: boyfriend
       Password: iloveyou
    
    Girlfriend:
       Username: girlfriend  
       Password: youremine
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    Tip: You can customize the messages, credentials, and content
        by editing the users object in server.js
    `);
});

module.exports = app;
