# Infra-Demo

A Docker Compose-based infrastructure demo including:

* Nginx reverse proxy
* Node.js App with Prometheus metrics endpoint
* PostgreSQL database
* Prometheus and Grafana monitoring
* Zookeeper and Kafka messaging
* TensorFlow Serving
* Firebase Cloud Messaging (Phase 5)

## Prerequisites

* Docker & Docker Compose installed
* Node.js & npm (for `kafka-demo` and AI export scripts)
* Python & TensorFlow (for exporting models)
* Git

## Project Structure

```
infra-demo/
├── app/
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
├── kafka-demo/
│   ├── producer.js
│   ├── consumer.js
│   └── package.json
├── models/
│   ├── export_mnist.py   # script to generate and export TF SavedModel
│   └── mnist/
│       └── 1/            # versioned SavedModel directory
├── nginx/
│   └── default.conf
├── prometheus.yml
├── docker-compose.yml
└── README.md
```

## Commands Executed

1. **Initialize Git**

   ```bash
   git init
   git add .
   git commit -m "chore: 초기 인프라 구성(nginx, app, db, monitoring, kafka)"
   git branch -M main
   git remote add origin <YOUR_REMOTE_URL>
   git push -u origin main
   ```

2. **Build and run infrastructure services**

   ```bash
   docker-compose build --no-cache app
   docker-compose up -d
   ```

3. **Verify containers**

   ```bash
   docker-compose ps
   ```

4. **Prometheus targets**

   * Open: [http://localhost:9090/targets](http://localhost:9090/targets)

5. **Grafana**

   * Add Prometheus data source: URL `http://prometheus:9090`
   * Import community dashboard ID `1860`

6. **Kafka setup**

   ```bash
   docker-compose up -d zookeeper kafka
   docker-compose exec kafka kafka-topics --create --topic test-topic --bootstrap-server kafka:9092 --partitions 1 --replication-factor 1
   docker-compose exec kafka kafka-topics --list --bootstrap-server kafka:9092
   ```

7. **Kafka console test**

   ```bash
   # Producer
   docker-compose exec kafka kafka-console-producer --broker-list kafka:9092 --topic test-topic
   # Consumer
   docker-compose exec kafka kafka-console-consumer --bootstrap-server kafka:9092 --topic test-topic --from-beginning
   ```

8. **Node.js producer/consumer**

   ```bash
   cd kafka-demo
   npm install
   npm run consume  # keep running
   npm run produce  # send one message
   ```

## Phase 4: AI Model Serving & Verification

1. **Generate and export TensorFlow SavedModel**

   ```bash
   # (Requires Python & TensorFlow installed)
   python models/export_mnist.py
   ```

2. **Add TF-Serving to Compose**

   ```yaml
   services:
     tf-serving:
       image: tensorflow/serving:latest
       volumes:
         - ./models:/models:ro
       ports:
         - "8501:8501"
       command: >
         --rest_api_port=8501
         --model_name=mnist
         --model_base_path=/models/mnist
   ```

3. **Start TF-Serving**

   ```bash
   docker-compose up -d tf-serving
   docker-compose logs tf-serving --tail 15
   ```

4. **Verify model availability**

   ```bash
   curl http://localhost:8501/v1/models/mnist
   ```

5. **Test prediction endpoint**

   ```bash
   python -c "import requests; data={'instances':[[0.0]*784]}; print(requests.post('http://localhost:8501/v1/models/mnist:predict', json=data).json())"
   ```

---

## Phase 5: Firebase Cloud Messaging (FCM) Setup

1. **Firebase 서비스 계정 키 생성**

   * Firebase 콘솔에서 프로젝트를 선택한 후, **서비스 계정(Service Accounts) → 비공개 키 생성**을 클릭해 JSON 파일을 다운로드합니다.
   * 다운로드한 파일을 `app/firebase-service-account.json` 위치에 저장합니다.

2. **환경 변수 설정**

   * 프로젝트 루트의 `.env` 파일에 아래 두 줄을 추가합니다:

     ```dotenv
     FCM_SERVICE_ACCOUNT=./app/firebase-service-account.json
     FCM_TOPIC=infra-demo-topic
     ```

3. **Docker Compose 설정**

   * `docker-compose.yml`의 `app` 서비스 블록에 다음을 추가하세요:

     ```yaml
     services:
       app:
         # …
         volumes:
           - ./app/firebase-service-account.json:/app/firebase-service-account.json:ro
         environment:
           - GOOGLE_APPLICATION_CREDENTIALS=/app/firebase-service-account.json
           - FCM_TOPIC=${FCM_TOPIC}
     ```

4. **서버 코드 구성**

   * **`src/fcmService.js`**: Firebase Admin SDK 초기화 및 `sendPushToTopic()`, `sendPush()` 함수 구현
   * **`src/routes/notifications.js`**: `/api/notify` 엔드포인트 구현
   * **`src/index.js`**: 라우터 등록 및 `/send-test-notification` 경로 추가

5. **클라이언트 FCM 모듈 작성**

   * **`src/firebase.js`**: Firebase JS SDK 초기화, `requestFcmToken(vapidKey)`, `onFcmMessage()` 함수 구현
   * **`public/index.html`**: 테스트 페이지 생성 (SW 등록, 토큰 발급 후 백엔드 전송 스크립트 포함)
   * **`public/firebase-messaging-sw.js`**: 서비스 워커 파일 추가

6. **빌드 및 실행**

   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

7. **검증**

   * **클라이언트(브라우저)**: `http://localhost:3000/index.html` 오픈 → 콘솔에 `✅ FCM 등록 토큰:` 로그 확인
   * **토픽 기반 푸시**:

     ```bash
     curl -X POST http://localhost:3000/send-test-notification -H "Content-Type: application/json" -d "{}"
     ```
   * **멀티캐스트 푸시**:

     ```bash
     curl -X POST http://localhost:3000/api/notify -H "Content-Type: application/json" -d '{"tokens":["<YOUR_TOKEN>"],"title":"테스트","body":"메시지입니다"}'
     ```

---

*Commit this updated README before proceeding to Phase 6.*
