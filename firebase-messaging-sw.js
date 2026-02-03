importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

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

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/lescayesdropshipping.jpg',
    // Nou ajoute done sa yo pou nou ka rekipere yo lè moun nan klike
    data: {
        title: payload.notification.title,
        body: payload.notification.body,
        url: "/moncompte.html?tab=mesaj"
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Lè itilizatè a klike sou notifikasyon an
self.addEventListener('notificationclick', function(event) {
  const notifData = event.notification.data;
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Si sit la deja ouvri, nou voye mesaj la ba li
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
      // Si sit la pa ouvri, nou ouvri l ak paramèt nan URL la
      if (clients.openWindow) {
        const urlWithParams = `${notifData.url}&msgTitle=${encodeURIComponent(notifData.title)}&msgBody=${encodeURIComponent(notifData.body)}`;
        return clients.openWindow(urlWithParams);
      }
    })
  );
});
