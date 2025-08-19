const { tick } = require('../src/tick');

console.log('Running simulation test...');
try {
  tick();
  console.log('Tick executed successfully');
} catch (e) {
  console.error('Tick failed', e);
  process.exit(1);
}
