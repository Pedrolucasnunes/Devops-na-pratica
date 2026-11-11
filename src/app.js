'use strict';

const express = require('express');
const { createTaskStore } = require('./taskStore');
const pkg = require('../package.json');

function createApp(store = createTaskStore()) {
  const app = express();
  app.use(express.json());

  // Health check usado pelo load balancer / monitoramento
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: pkg.version, uptime: process.uptime() });
  });

  app.get('/tasks', (req, res) => {
    res.json(store.list(req.query.status));
  });

  app.get('/tasks/:id', (req, res) => {
    const task = store.get(Number(req.params.id));
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
    return res.json(task);
  });

  app.post('/tasks', (req, res) => {
    const { task, errors } = store.create(req.body || {});
    if (errors) return res.status(400).json({ errors });
    return res.status(201).json(task);
  });

  app.put('/tasks/:id', (req, res) => {
    const result = store.update(Number(req.params.id), req.body || {});
    if (result.notFound) return res.status(404).json({ error: 'Tarefa não encontrada' });
    if (result.errors) return res.status(400).json({ errors: result.errors });
    return res.json(result.task);
  });

  app.delete('/tasks/:id', (req, res) => {
    const removed = store.remove(Number(req.params.id));
    if (!removed) return res.status(404).json({ error: 'Tarefa não encontrada' });
    return res.status(204).send();
  });

  app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada' }));

  return app;
}

module.exports = { createApp };
