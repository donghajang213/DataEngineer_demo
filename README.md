# Infra-Demo

A Docker Compose-based infrastructure demo including:

* Nginx reverse proxy
* Node.js App with Prometheus metrics endpoint
* PostgreSQL database
* Prometheus and Grafana monitoring
* Zookeeper and Kafka messaging

## Prerequisites

* Docker & Docker Compose installed
* Node.js & npm (for `kafka-demo`)
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
├── models/            # (for Phase 4)
│   └── models.config
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

2. **Build and run services**

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

   * Add data source: URL `http://prometheus:9090`
   * Import dashboard ID `1860`

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
   npm run produce  # sends one message
   ```

## Next Steps (Phase 4)

* Prepare TensorFlow models under `models/`
* Add `tf-serving` service to `docker-compose.yml`
* Test `http://localhost:8501/v1/models/<model>`

---

