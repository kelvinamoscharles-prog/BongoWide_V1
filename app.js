import { database, ref, push, onChildAdded, set, serverTimestamp } from './firebase-config.js';

let currentChatId = null;
let currentChatName = '';

function initializeApp() {
    initializeNavigation();
    initializeToolbar();
    initializeChat();
    loadDemoChats();
}

function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const screens = document.querySelectorAll('.screen');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const screenId = btn.dataset.screen;

            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            screens.forEach(s => s.classList.remove('active'));
            document.getElementById(screenId).classList.add('active');
        });
    });
}

function initializeToolbar() {
    const themeBtn = document.getElementById('themeBtn');
    const themeSelector = document.getElementById('themeSelector');
    const profileBtn = document.getElementById('profileBtn');
    const profileDrawer = document.getElementById('profileDrawer');
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const colorBtns = document.querySelectorAll('.color-btn');

    themeBtn.addEventListener('click', () => {
        themeSelector.classList.toggle('active');
        profileDrawer.classList.remove('active');
    });

    profileBtn.addEventListener('click', () => {
        profileDrawer.classList.toggle('active');
        themeSelector.classList.remove('active');
    });

    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        document.getElementById('searchInput').focus();
    });

    closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            document.documentElement.style.setProperty('--primary-color', color);

            const darkColor = adjustColor(color, -20);
            const lightColor = adjustColor(color, 60);
            document.documentElement.style.setProperty('--primary-dark', darkColor);
            document.documentElement.style.setProperty('--primary-light', lightColor);

            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            themeSelector.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!themeSelector.contains(e.target) && !themeBtn.contains(e.target)) {
            themeSelector.classList.remove('active');
        }
        if (!profileDrawer.contains(e.target) && !profileBtn.contains(e.target)) {
            profileDrawer.classList.remove('active');
        }
    });
}

function adjustColor(color, percent) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
        (G<255?G<1?0:G:255)*0x100 +
        (B<255?B<1?0:B:255))
        .toString(16).slice(1);
}

function initializeChat() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const backBtn = document.getElementById('backBtn');

    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    backBtn.addEventListener('click', () => {
        document.querySelector('.chat-list').classList.remove('hide');
        document.querySelector('.chat-window').classList.remove('show');
    });
}

function loadDemoChats() {
    const chatsContainer = document.getElementById('chatsContainer');

    const demoChats = [
        { id: 'chat1', name: 'John Doe', message: 'Hey! How are you?', time: '10:30 AM', avatar: 'J' },
        { id: 'chat2', name: 'Jane Smith', message: 'See you tomorrow!', time: '09:15 AM', avatar: 'J' },
        { id: 'chat3', name: 'Tech Group', message: 'New updates available', time: 'Yesterday', avatar: 'T' },
        { id: 'chat4', name: 'Mom', message: 'Call me when you can', time: 'Yesterday', avatar: 'M' },
        { id: 'chat5', name: 'Work Team', message: 'Meeting at 3 PM', time: 'Monday', avatar: 'W' }
    ];

    demoChats.forEach(chat => {
        const chatElement = createChatElement(chat);
        chatsContainer.appendChild(chatElement);
    });
}

function createChatElement(chat) {
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item';
    chatItem.dataset.chatId = chat.id;

    chatItem.innerHTML = `
        <div class="chat-avatar">${chat.avatar}</div>
        <div class="chat-item-info">
            <div class="chat-item-header">
                <span class="chat-item-name">${chat.name}</span>
                <span class="chat-item-time">${chat.time}</span>
            </div>
            <div class="chat-item-message">${chat.message}</div>
        </div>
    `;

    chatItem.addEventListener('click', () => {
        openChat(chat.id, chat.name);
    });

    return chatItem;
}

function openChat(chatId, chatName) {
    currentChatId = chatId;
    currentChatName = chatName;

    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });

    const selectedChat = document.querySelector(`[data-chat-id="${chatId}"]`);
    if (selectedChat) {
        selectedChat.classList.add('active');
    }

    document.querySelector('.chat-window-placeholder').style.display = 'none';
    document.getElementById('chatMessages').style.display = 'flex';
    document.getElementById('chatName').textContent = chatName;

    if (window.innerWidth <= 768) {
        document.querySelector('.chat-list').classList.add('hide');
        document.querySelector('.chat-window').classList.add('show');
    }

    loadMessages(chatId);
}

function loadMessages(chatId) {
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = '';

    const messagesRef = ref(database, `chats/${chatId}/messages`);

    onChildAdded(messagesRef, (snapshot) => {
        const message = snapshot.val();
        displayMessage(message);
    });
}

function displayMessage(message) {
    const messagesContainer = document.getElementById('messagesContainer');

    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.sender === 'me' ? 'sent' : 'received'}`;

    const time = message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now';

    messageElement.innerHTML = `
        <div class="message-bubble">
            <div class="message-text">${escapeHtml(message.text)}</div>
            <div class="message-time">${time}</div>
        </div>
    `;

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();

    if (messageText && currentChatId) {
        const messagesRef = ref(database, `chats/${currentChatId}/messages`);
        const newMessageRef = push(messagesRef);

        set(newMessageRef, {
            text: messageText,
            sender: 'me',
            timestamp: Date.now()
        });

        messageInput.value = '';

        setTimeout(() => {
            simulateResponse();
        }, 1000 + Math.random() * 2000);
    }
}

function simulateResponse() {
    if (!currentChatId) return;

    const responses = [
        "That's great!",
        "I see what you mean",
        "Thanks for letting me know",
        "Sounds good!",
        "Got it!",
        "👍",
        "Looking forward to it",
        "Sure thing!"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const messagesRef = ref(database, `chats/${currentChatId}/messages`);
    const newMessageRef = push(messagesRef);

    set(newMessageRef, {
        text: randomResponse,
        sender: 'other',
        timestamp: Date.now()
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', initializeApp);
