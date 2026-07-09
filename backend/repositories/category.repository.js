const db = require('../config/db');

const repository = {
  create: async (data) => {
    try {
      const { name, monthly_budget } = data;
      const sql = `
        INSERT INTO categories (name, monthly_budget)
        VALUES (?, ?)
      `;
      const result = await db.run(sql, [name, monthly_budget]);
      return await repository.findById(result.id);
    } catch (error) {
      throw error;
    }
  },

  findAll: async (query = {}) => {
    try {
      let sql = `
        SELECT id, name, monthly_budget, created_at, updated_at
        FROM categories
      `;
      const params = [];

      if (query.name) {
        sql += ` WHERE name LIKE ?`;
        params.push(`%${query.name}%`);
      }

      sql += ` ORDER BY name ASC`;
      return await db.query(sql, params);
    } catch (error) {
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const sql = `
        SELECT id, name, monthly_budget, created_at, updated_at
        FROM categories
        WHERE id = ?
      `;
      return await db.get(sql, [id]);
    } catch (error) {
      throw error;
    }
  },

  findOne: async (query = {}) => {
    try {
      const whereClauses = [];
      const params = [];

      if (query.name) {
        whereClauses.push('name = ?');
        params.push(query.name);
      }

      if (query.id) {
        whereClauses.push('id = ?');
        params.push(query.id);
      }

      const whereSql = whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : '';
      const sql = `
        SELECT id, name, monthly_budget, created_at, updated_at
        FROM categories${whereSql}
      `;
      return await db.get(sql, params);
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const { name, monthly_budget } = data;
      const sql = `
        UPDATE categories
        SET name = ?, monthly_budget = ?
        WHERE id = ?
      `;
      await db.run(sql, [name, monthly_budget, id]);
      return await repository.findById(id);
    } catch (error) {
      throw error;
    }
  },

  softDelete: async (id) => {
    try {
      const sql = `DELETE FROM categories WHERE id = ?`;
      const result = await db.run(sql, [id]);
      return result.changes > 0;
    } catch (error) {
      throw error;
    }
  },

  count: async (query = {}) => {
    try {
      let sql = `SELECT COUNT(*) as count FROM categories`;
      const params = [];

      if (query.name) {
        sql += ` WHERE name LIKE ?`;
        params.push(`%${query.name}%`);
      }

      const row = await db.get(sql, params);
      return row ? row.count : 0;
    } catch (error) {
      throw error;
    }
  },

  countExpenses: async (id) => {
    try {
      const sql = `
        SELECT COUNT(*) as count
        FROM expenses
        WHERE category_id = ?
      `;
      const row = await db.get(sql, [id]);
      return row ? row.count : 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = repository;

