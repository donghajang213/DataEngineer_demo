// src/fcmService.js
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

// Firebase Admin 초기화 (한번만)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/**
 * 주제(topic) 기반 푸시 보내기 (변경 없음)
 */
async function sendPushToTopic(topic, notification, data = {}) {
  return admin.messaging().send({ topic, notification, data });
}

/**
 * 다중 토큰(multicast) 기반 푸시 보내기
 * @param {string[]} tokens 
 * @param {{title:string,body:string,data?:object}} payload 
 */
async function sendPush(tokens, payload) {
  let successCount = 0;
  let failureCount = 0;
  const responses = [];

  for (const token of tokens) {
    try {
      const resp = await admin.messaging().send({
        token,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data || {},
      });
      successCount++;
      responses.push({ token, response: resp });
    } catch (err) {
      failureCount++;
      responses.push({ token, error: err.message });
    }
  }

  return { successCount, failureCount, responses };
}

module.exports = { sendPushToTopic, sendPush };
