// Importation des bibliothèques nécessaires pour le fonctionnement en arrière-plan
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Configuration Firebase extraite de votre console
const firebaseConfig = {
  apiKey: "AIzaSyClITNBRZPS7uCGFtbCvcW3CE-KH3VHOyI",
  authDomain: "les-cayes-dropshipping.firebaseapp.com",
  projectId: "les-cayes-dropshipping",
  storageBucket: "les-cayes-dropshipping.firebasestorage.app",
  messagingSenderId: "32618386616",
  appId: "1:32618386616:web:ab8641da3659263fe0904d"
};

// Initialisation de Firebase dans le Service Worker
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Gestion des messages reçus lorsque l'application est en arrière-plan ou fermée
messaging.onBackgroundMessage((payload) => {
  console.log('Message reçu en arrière-plan :', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/lescayesdropshipping.jpg' // Assurez-vous que cette image existe sur votre Vercel
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


