// public/firebase-messaging-sw.js

// Firebase App 스크립트 (버전 맞춰서)
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Firebase Console → 프로젝트 설정에서 복사한 설정 객체
firebase.initializeApp({
  apiKey: "AIzaSyBafpy_bY6MTv11YMpogcCOiZFCHN_pTBE",
  authDomain: "dataengineer-demo-a51c4.firebaseapp.com",
  projectId: "dataengineer-demo-a51c4",
  storageBucket: "dataengineer-demo-a51c4.appspot.com",
  messagingSenderId: "851053001277",
  appId: "1:851053001277:web:e37a28de2fafcaaa454854",
  measurementId: "G-GZ54TGCB0S"
});

// 서비스 워커에 Messaging 인스턴스 연결
const messaging = firebase.messaging();

// 백그라운드 푸시를 받을 때 동작
messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title, {
    body,
    icon: '/firebase-logo.png' // 있으면 아이콘 지정
  });
});
