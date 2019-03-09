const cluster = require('cluster');
if (cluster.isMaster) {
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
} else {
  const express = require('express');
  const app = express();
  function doWork(duration) {
    const start = Date.now();
    while (Date.now() - start < duration) {}
  }
  app.get('/', (req, res) => {
    console.log('worker id:' + cluster.worker.id); // worker id: 1 - loop started
    doWork(5000);
    res.send('Hi there');
  });
  app.get('/fast', (req, res) => {
    console.log('worker id:' + cluster.worker.id); // worker id: 1 - this process is waiting till loop is over
    res.send('Fast one!');
  });
  app.get('/fast2', (req, res) => {
    console.log('worker id:' + cluster.worker.id); // worker 2 - this is working fast
    res.send('Fast two!');
  });
  app.listen(3000);
}
