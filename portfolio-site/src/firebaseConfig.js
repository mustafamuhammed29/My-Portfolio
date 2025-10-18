// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// هام جداً: قم باستبدال هذا الكائن بمعلومات Firebase الخاصة بمشروعك
const firebaseConfig = {
    apiKey: "AIzaSyDkqFOI2FzXGkZal3BaIQ-VhFb3GfTDn4Y",
    authDomain: "my-portfolio-app-5b70f.firebaseapp.com",
    projectId: "my-portfolio-app-5b70f",
    storageBucket: "my-portfolio-app-5b70f.firebasestorage.app",
    messagingSenderId: "150685946551",
    appId: "1:150685946551:web:761c8a2506b71b70d5b332"
};
// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تصدير قاعدة البيانات لاستخدامها في المكونات الأخرى
export const db = getFirestore(app);

