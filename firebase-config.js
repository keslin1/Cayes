// Konfigirasyon Firebase SDK
const firebaseConfig = {
  apiKey: "API_KEY_OU_A",
  authDomain: "les-cayes-dropshipping.firebaseapp.com",
  projectId: "les-cayes-dropshipping",
  storageBucket: "les-cayes-dropshipping.appspot.com",
  messagingSenderId: "SENDER_ID_OU_A",
  appId: "APP_ID_OU_A"
};

// Inisyalize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Mande pèmisyon pou voye notifikasyon
messaging.requestPermission()
  .then(() => {
    console.log('Pèmisyon aksepte!');
    return messaging.getToken();
  })
  .then((token) => {
    console.log('Token aparèy la se:', token);
    // Isit la ou ka voye token sa a nan database ou si ou gen youn
  })
  .catch((err) => {
    console.log('Erè notifikasyon:', err);
  });


