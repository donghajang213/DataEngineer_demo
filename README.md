# Infra-Demo

A Docker Compose-based infrastructure demo including:

* Nginx reverse proxy
* Node.js App with Prometheus metrics endpoint
* PostgreSQL database
* Prometheus and Grafana monitoring
* Zookeeper and Kafka messaging

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

   * Exports model to `models/mnist/1` with proper signature.

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
   # Expect: AVAILABLE state
   ```

5. **Test prediction endpoint**

   ```bash
   python -c "import requests; data={'instances':[[0.0]*784]}; print(requests.post('http://localhost:8501/v1/models/mnist:predict', json=data).json())"
   # Expect: {'predictions': [[...10 values...]]}
   ```

---

*Commit this updated README before proceeding to Phase 5.*
