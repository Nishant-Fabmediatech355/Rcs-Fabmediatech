import { messageQueue } from '../queues/messageQueue.js';

messageQueue.process(async (job) => {
  const { phone, message } = job.data;
  console.log(`Sending RCS to ${phone}: ${message}`);
  // TODO: Add ValueFirst API logic here
});
