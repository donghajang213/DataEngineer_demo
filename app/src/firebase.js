// src/firebase.js — 클라이언트 전용
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase Console 에서 복사한 설정
const firebaseConfig = {
  apiKey: "AIzaSyBafpy_bY6MTv11YMpogcCOiZFCHN_pTBE",
  authDomain: "dataengineer-demo-a51c4.firebaseapp.com",
  projectId: "dataengineer-demo-a51c4",
  storageBucket: "dataengineer-demo-a51c4.appspot.com",
  messagingSenderId: "851053001277",
  appId: "1:851053001277:web:e37a28de2fafcaaa454854",
  measurementId: "G-GZ54TGCB0S"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

/**
 * FCM 토큰 요청 함수
 */
export async function requestFcmToken(vapidKey) {
  if (Notification.permission !== "granted") {
    await Notification.requestPermission();
  }
  return getToken(messaging, { vapidKey });
}

/**
 * 포그라운드 메시지 수신
 */
export function onFcmMessage(callback) {
  onMessage(messaging, callback);
}
