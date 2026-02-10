// 1. Enstalasyon Service Worker la
self.addEventListener('install', (event) => {
    console.log('Service Worker installé.');
    self.skipWaiting(); // Fòse SW a vin aktif touswit
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker aktif.');
});

// 2. Jesyon rezo (Pou Google rekonèt li kòm PWA)
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request).catch(() => {
        return caches.match(event.request);
    }));
});

// 3. Jesyon Notifikasyon (PUSH)
self.addEventListener('push', function(event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const data = event.data ? event.data.json() : {};
    const title = data.notification ? data.notification.title : 'Nouvo mesaj LCDrop';
    const body = data.notification ? data.notification.body : 'Ou gen yon nouvo notifikasyon.';

    const options = {
        body: body,
        icon: '/lescayesdropshipping.jpg', // Asire w foto sa egziste nan rasin sit la
        badge: '/lescayesdropshipping.jpg',
        vibrate: [200, 100, 200],
        tag: 'lcdrop-notif-tag', // Evite repetisyon menm mesaj la
        data: {
            url: '/moncompte.html' // Kote pou l ale si l klike
        }
    };

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // Tcheke si itilizatè a deja sou aplikasyon an
            const isAppFocused = clientList.some(client => client.focused);

            // Voye mesaj la bay paj la pou l ka anrejistre l nan LocalStorage (badge la ap parèt)
            clientList.forEach(client => {
                client.postMessage({
                    type: 'SAVE_NOTIF',
                    title: title,
                    body: body
                });
            });

            // Si aplikasyon an PA louvri, nou montre notifikasyon sistèm lan (Android/iOS)
            if (!isAppFocused) {
                return self.registration.showNotification(title, options);
            }
        })
    );
});

// 4. Lè itilizatè a klike sou notifikasyon an
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let client of clientList) {
                if (client.url.includes('moncompte.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/moncompte.html');
            }
        })
    );
});
