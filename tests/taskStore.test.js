'use strict';

const { createTaskStore } = require('../src/taskStore');

describe('taskStore (testes unitários)', () => {
  let store;
  beforeEach(() => {
    store = createTaskStore();
  });

  test('cria tarefa com status padrão "pendente"', () => {
    const { task } = store.create({ title: 'Estudar CI' });
    expect(task).toMatchObject({ id: 1, title: 'Estudar CI', status: 'pendente' });
  });

  test('rejeita título curto', () => {
    const { errors } = store.create({ title: 'ab' });
    expect(errors).toHaveLength(1);
  });

  test('rejeita status inválido', () => {
    const { errors } = store.create({ title: 'Tarefa', status: 'xpto' });
    expect(errors[0]).toMatch(/status/);
  });

  test('filtra por status', () => {
    store.create({ title: 'Tarefa A' });
    store.create({ title: 'Tarefa B', status: 'concluida' });
    expect(store.list('concluida')).toHaveLength(1);
    expect(store.list()).toHaveLength(2);
  });

  test('atualiza e remove tarefa', () => {
    const { task } = store.create({ title: 'Tarefa A' });
    const { task: updated } = store.update(task.id, { status: 'em_andamento', description: 'x' });
    expect(updated.status).toBe('em_andamento');
    expect(store.remove(task.id)).toBe(true);
    expect(store.remove(task.id)).toBe(false);
  });

  test('update de tarefa inexistente retorna notFound', () => {
    expect(store.update(99, { title: 'Nova' })).toEqual({ notFound: true });
  });
});
