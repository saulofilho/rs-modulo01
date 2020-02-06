const express = require('express');

const server = express();

server.use(express.json());

const users = ['saulo', 'rafa', 'bisteca'];

server.use((req, res, next) => {
  console.time('Request');
  console.log(`Method: ${req.method}; URL: ${req.url}`);

  next();
  console.timeEnd('Request');
});

function checkUserExists(req, res, next) {
  if(!req.body.name) {
    return res.status(400).json({ error: 'Username is required.' })
  }

  return next();
};

function checkUserIn(req, res, next) {
  const user = users[req.params.index];
  if(!user) {
    return res.status(400).json({ error: 'User doesnt exists.' })
  }

  req.user = user;

  return next();
}

server.get('/users', (req, res) => {
  return res.json(users);
});

// query params = ?nome=1
server.get('/users', (req, res) => {
  const { nome } = req.query;

  return res.json({ message: `Hello, ${nome}`});
});

// route params = /users/1
server.get('/users/:index', checkUserIn, (req, res) => {
  return res.json(req.user);
});

// requesty body = { "name": "saulo" }
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// editar
server.put('/users/:index', checkUserExists, checkUserIn, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

// deletar
server.delete('/users/:index', checkUserIn, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send({ message: "Deletado com sucesso."});
});

server.listen(3000);
