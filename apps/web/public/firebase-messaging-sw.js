// Firebase Messaging Service Worker
// This file must be in the public directory to be accessible

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Will be replaced with actual config
  authDomain: "fitness-tracker-dev-4499e.firebaseapp.com",
  projectId: "fitness-tracker-dev-4499e",
  storageBucket: "fitness-tracker-dev-4499e.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'Fitness Tracker';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    data: payload.data,
    tag: payload.data?.type || 'default',
    requireInteraction: false,
    silent: false
  };

  // Show notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');

  event.notification.close();

  // Handle different notification types
  const data = event.notification.data;
  let url = '/dashboard'; // Default URL

  if (data?.type) {
    switch (data.type) {
      case 'workout':
        url = '/workout';
        break;
      case 'goal':
        url = '/goals';
        break;
      case 'achievement':
        url = '/dashboard';
        break;
      case 'steps':
        url = '/dashboard';
        break;
      case 'meal':
        url = '/dashboard';
        break;
      case 'motivation':
        url = '/dashboard';
        break;
      default:
        url = '/dashboard';
    }
  }

  // Open the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window/tab is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Handle push events
self.addEventListener('push', (event) => {
  console.log('[firebase-messaging-sw.js] Push event received.');

  if (event.data) {
    const data = event.data.json();
    const notificationTitle = data.notification?.title || 'Fitness Tracker';
    const notificationOptions = {
      body: data.notification?.body || 'You have a new notification',
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      data: data.data,
      tag: data.data?.type || 'default',
      requireInteraction: false,
      silent: false
    };

    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  }
});

// Handle service worker installation
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker installed.');
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activated.');
  event.waitUntil(self.clients.claim());
}); 