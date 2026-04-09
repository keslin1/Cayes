// ===============================================================
//  firebase-messaging-sw.js — Les Cayes Dropshipping (Version Unique)
// ===============================================================

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyClITNBRZPS7uCGFtbCvcW3CE-KH3VHOyI",
  authDomain: "les-cayes-dropshipping.firebaseapp.com",
  projectId: "les-cayes-dropshipping",
  storageBucket: "les-cayes-dropshipping.firebasestorage.app",
  messagingSenderId: "32618386616",
  appId: "1:32618386616:web:ab8641da3659263fe0904d"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Gère l'affichage quand l'application est en arrière-plan
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/lescayesdropshipping.png',
    badge: '/lescayesdropshipping.png',
    data: {
        title: payload.notification.title,
        body: payload.notification.body,
        url: "/moncompte.html?tab=mesaj"
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Action au clic sur la notification
self.addEventListener('notificationclick', function(event) {
  const notifData = event.notification.data;
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // 1. Si un onglet est déjà ouvert, on le focus et on envoie le message
      for (const client of clientList) {
        if (client.url.includes('moncompte.html') && 'focus' in client) {
          client.postMessage({
            type: 'SAVE_NOTIF',
            title: notifData.title,
            body: notifData.body
          });
          return client.focus();
        }
      }
      // 2. Si rien n'est ouvert, on ouvre une nouvelle fenêtre avec les paramètres
      if (clients.openWindow) {
        const urlWithParams = `${notifData.url}&msgTitle=${encodeURIComponent(notifData.title)}&msgBody=${encodeURIComponent(notifData.body)}`;
        return clients.openWindow(urlWithParams);
      }
    })
  );
});
