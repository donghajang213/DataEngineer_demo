// kafka-demo/producer.js

const { Kafka } = require('kafkajs');

async function runProducer() {
  // 환경변수로 브로커 리스트 지정 (콤마 구분)
  const brokers = process.env.KAFKA_BROKERS
    ? process.env.KAFKA_BROKERS.split(',')
    : ['localhost:9092'];
  const kafka = new Kafka({ brokers });
  const producer = kafka.producer();
  await producer.connect();
  const msg = { value: 'Hello from Node producer!' };
  await producer.send({ topic: 'test-topic', messages: [msg] });
  console.log('Message sent:', msg.value);
  await producer.disconnect();
}

runProducer().catch(console.error);
