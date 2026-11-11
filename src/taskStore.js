'use strict';

const VALID_STATUS = ['pendente', 'em_andamento', 'concluida'];

/**
 * Armazenamento em memória das tarefas.
 * Na Fase 2 pode ser trocado por um banco (ex.: DynamoDB/RDS) sem mudar as rotas.
 */
function createTaskStore() {
  let tasks = [];
  let nextId = 1;

  function validate(data, { partial = false } = {}) {
    const errors = [];
    if (!partial || data.title !== undefined) {
      if (typeof data.title !== 'string' || data.title.trim().length < 3) {
        errors.push('title deve ser um texto com pelo menos 3 caracteres');
      }
    }
    if (data.status !== undefined && !VALID_STATUS.includes(data.status)) {
      errors.push(`status deve ser um de: ${VALID_STATUS.join(', ')}`);
    }
    return errors;
  }

  return {
    list(status) {
      return status ? tasks.filter((t) => t.status === status) : [...tasks];
    },
    get(id) {
      return tasks.find((t) => t.id === id) || null;
    },
    create(data) {
      const errors = validate(data);
      if (errors.length) return { errors };
      const now = new Date().toISOString();
      const task = {
        id: nextId++,
        title: data.title.trim(),
        description: data.description ? String(data.description) : '',
        status: data.status || 'pendente',
        createdAt: now,
        updatedAt: now,
      };
      tasks.push(task);
      return { task };
    },
    update(id, data) {
      const task = this.get(id);
      if (!task) return { notFound: true };
      const errors = validate(data, { partial: true });
      if (errors.length) return { errors };
      if (data.title !== undefined) task.title = data.title.trim();
      if (data.description !== undefined) task.description = String(data.description);
      if (data.status !== undefined) task.status = data.status;
      task.updatedAt = new Date().toISOString();
      return { task };
    },
    remove(id) {
      const before = tasks.length;
      tasks = tasks.filter((t) => t.id !== id);
      return tasks.length < before;
    },
  };
}

module.exports = { createTaskStore, VALID_STATUS };
