const cluster = require('cluster');

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  console.log('worker id:' + cluster.worker.id); // worker id: 1 - loop started
  res.send('Hi there');
});

app.get('/fast', (req, res) => {
  console.log('worker id:' + cluster.worker.id); // worker id: 1 - this process is waiting till loop is over
  res.send('Fast one!');
});

app.listen(3000);
