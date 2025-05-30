// src/index.js
require('dotenv').config();
const express = require('express');
const client = require('prom-client');
const path = require('path');               // ① path 모듈을 먼저 require

// 기본 Node.js 프로세스 메트릭 수집 시작
client.collectDefaultMetrics();

const adminSDK = require('./fcmService');
const notifyRouter = require('./routes/notifications');

const app = express();                      // ② express 앱 객체 생성

// ③ public 폴더를 정적 파일 루트로 설정
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());

// Prometheus 메트릭스
app.get('/metrics', async (req, res) => {
  console.log('[metrics] endpoint called');
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// 루트 엔드포인트
app.get('/', (req, res) => res.send('Hello from Dockerized App!'));

// FCM 테스트 링크
app.post('/send-test-notification', async (req, res) => {
  try {
    const message = {
      topic: process.env.FCM_TOPIC,
      notification: {
        title: 'Test Notification',
        body: 'Hello from Firebase Cloud Messaging!',
      },
    };
    const response = await adminSDK.sendPushToTopic(message.topic, message.notification);
    res.json({ success: true, response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 푸시 알림 API
app.use('/api/notify', notifyRouter);

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
