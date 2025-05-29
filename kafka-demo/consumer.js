// kafka-demo/consumer.js

const { Kafka } = require('kafkajs');

async function runConsumer() {
  const brokers = process.env.KAFKA_BROKERS
    ? process.env.KAFKA_BROKERS.split(',')
    : ['localhost:9092'];
  const kafka = new Kafka({ brokers });
  const consumer = kafka.consumer({ groupId: 'demo-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log('Received:', message.value.toString());
    },
  });
}

runConsumer().catch(console.error);
