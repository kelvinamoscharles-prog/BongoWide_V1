import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, push, onChildAdded, set, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyDemoKey-ReplaceWithYourActualKey",
    authDomain: "bongowide-demo.firebaseapp.com",
    databaseURL: "https://bongowide-demo-default-rtdb.firebaseio.com",
    projectId: "bongowide-demo",
    storageBucket: "bongowide-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, push, onChildAdded, set, serverTimestamp };
