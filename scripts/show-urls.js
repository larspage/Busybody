// Wait for both services to start, then display URLs
import waitOn from 'wait-on';

const FRONTEND_URL = 'http://localhost:5170';
const BACKEND_URL = 'http://localhost:5171';
const HEALTH_URL = `${BACKEND_URL}/health`;

const opts = {
  resources: [
    FRONTEND_URL,
    HEALTH_URL
  ],
  delay: 1000,
  interval: 1000,
  timeout: 60000
};

console.log('\nWaiting for services to start...\n');

waitOn(opts).then(() => {
  console.log('\x1b[32m%s\x1b[0m', '\n✨ All services are running!\n');
  console.log('Frontend URL: \x1b[36m%s\x1b[0m', FRONTEND_URL);
  console.log('Backend API: \x1b[36m%s\x1b[0m', BACKEND_URL);
  console.log('Health Check: \x1b[36m%s\x1b[0m\n', HEALTH_URL);
}).catch((err) => {
  console.error('\x1b[31m%s\x1b[0m', '\n❌ Error waiting for services:');
  console.error(err);
  process.exit(1);
});