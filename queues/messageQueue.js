import Queue from 'bull';

export const messageQueue = new Queue('messageQueue', {
  redis: { host: '127.0.0.1', port: 6379 },
});
