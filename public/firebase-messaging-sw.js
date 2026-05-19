importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// These will be replaced by actual config if needed, or we can use the main app config
// For the SW to work, it often needs the messagingSenderId at minimum
firebase.initializeApp({
  messagingSenderId: "882278414758" 
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png', // Fallback icon
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
