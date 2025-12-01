# BongoWide Chat App

A modern real-time chat application with 5 tabs: Chat, Updates, Groups, World, and Calls.

## Features

- **Real-time Chat**: Firebase-powered instant messaging
- **5 Tab Navigation**: Chat, Updates, Groups, World, Calls
- **Theme Customization**: Choose from 6 different color themes
- **Profile Drawer**: WhatsApp-style profile interface
- **Search Functionality**: Search across messages and contacts
- **Responsive Design**: Works on desktop and mobile devices

## Firebase Setup

To enable real-time chat functionality, you need to set up Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Realtime Database
4. Copy your Firebase configuration
5. Replace the configuration in `firebase-config.js` with your actual Firebase credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Usage

- **Chat Tab**: Send and receive real-time messages
- **Updates Tab**: View status updates
- **Groups Tab**: Create and manage group chats
- **World Tab**: Discover news and content
- **Calls Tab**: Manage voice and video calls

Enjoy using BongoWide!
