self.addEventListener('install', (event) => {
    console.log('Service Worker installé.');
});

self.addEventListener('fetch', (event) => {
    // Sa a sifi pou Google rekonèt li kòm yon PWA
    event.respondWith(fetch(event.request));
});
