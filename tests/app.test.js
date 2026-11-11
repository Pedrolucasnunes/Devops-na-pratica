'use strict';

const request = require('supertest');
const { createApp } = require('../src/app');

describe('API /tasks (testes de integração)', () => {
  let app;
  beforeEach(() => {
    app = createApp();
  });

  test('GET /health responde ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('fluxo completo: criar, listar, buscar, atualizar e excluir', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Configurar pipeline' });
    expect(created.status).toBe(201);
    const { id } = created.body;

    const list = await request(app).get('/tasks');
    expect(list.body).toHaveLength(1);

    const one = await request(app).get(`/tasks/${id}`);
    expect(one.body.title).toBe('Configurar pipeline');

    const updated = await request(app).put(`/tasks/${id}`).send({ status: 'concluida' });
    expect(updated.status).toBe(200);
    expect(updated.body.status).toBe('concluida');

    const filtered = await request(app).get('/tasks?status=concluida');
    expect(filtered.body).toHaveLength(1);

    const removed = await request(app).delete(`/tasks/${id}`);
    expect(removed.status).toBe(204);
  });

  test('POST /tasks com dados inválidos retorna 400', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  test('PUT com status inválido retorna 400', async () => {
    const { body } = await request(app).post('/tasks').send({ title: 'Tarefa' });
    const res = await request(app).put(`/tasks/${body.id}`).send({ status: 'invalido' });
    expect(res.status).toBe(400);
  });

  test.each([
    ['get', '/tasks/999'],
    ['put', '/tasks/999'],
    ['delete', '/tasks/999'],
    ['get', '/rota-inexistente'],
  ])('%s %s retorna 404', async (method, url) => {
    const res = await request(app)[method](url).send({ title: 'Qualquer' });
    expect(res.status).toBe(404);
  });
});
