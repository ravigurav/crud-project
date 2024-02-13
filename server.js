const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length - 1;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const express = require('express');
  const bodyParser = require('body-parser');
  const userRoutes = require('./routes/users');

  // require('dotenv').config();

  const app = express();

  const PORT = process.env.PORT || 4000;

  const workerPort = PORT + cluster.worker.id;

  app.use(bodyParser.json());

  app.use('/api/users', userRoutes);

  app.get('/', (req, res) => {
    console.log('TEST');
    res.send('Hello from Homepage.');
  });

  app.listen(workerPort, () => {
    console.log(`Worker ${cluster.worker.id} listening on port ${workerPort}`);
  });
}
