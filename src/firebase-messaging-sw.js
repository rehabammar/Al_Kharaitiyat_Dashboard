importScripts("https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js");

// نفس config اللي عندك في Angular
firebase.initializeApp({
  apiKey: "AIzaSyAoEMyhSD1-ArhJnX3Quu7SEicd4aApBLE",
  authDomain: "khyrtiat-education-center.firebaseapp.com",
  projectId: "khyrtiat-education-center",
  storageBucket: "khyrtiat-education-center.firebasestorage.app",
  messagingSenderId: "198130175301",
  appId: "1:198130175301:web:3228adfc839e80a784422c",
  measurementId: "G-YQDBDPVCYS"
});

// background handler
const messaging = firebase.messaging();

// اختياري: لما توصّل رسالة في الخلفية، ابعتي postMessage للصفحات المفتوحة
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'New message';
  const options = {
    body: payload.notification?.body,
    icon: '/assets/icons/notification-icon.png',
    data: { refresh: true } // علامة مفيدة
  };
  // self.registration.showNotification(title, options);

  self.registration.showNotification(title, options);
  
  // ابعتي إشارة للـ clients (التابات المفتوحة)
  self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    cs.forEach(c => c.postMessage({ type: 'REFRESH', payload: payload.data || null }));
  });

  self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
    clients.forEach(c => c.postMessage({
      type: 'PLAY_SOUND',
      payload
    }));
  });
});

// لو عايز تشغّل صوت بمجرد الإشعار ييجي (مش كل المتصفحات تسمح):
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({ includeUncontrolled: true });
      if (allClients.length > 0) {
        allClients[0].postMessage({ type: 'PLAY_SOUND' });
      }
    })()
  );
});

// عند الضغط على الإشعار
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    // ابعتي REFRESH لكل النوافذ المفتوحة
    allClients.forEach(c => c.postMessage({ type: 'REFRESH', source: 'notificationclick' }));

    // افتحي/ركّزي نافذة
    if (allClients.length) {
      return allClients[0].focus();
    } else {
      return self.clients.openWindow('/'); // غيريها للمسار المناسب
    }
  })());
});






