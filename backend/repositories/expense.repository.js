const db = require('../config/db');

const repository = {
  create: async (data) => {
    try {
      const { amount, description, category_id, expense_date } = data;
      const sql = `
        INSERT INTO expenses (amount, description, category_id, expense_date)
        VALUES (?, ?, ?, ?)
      `;
      const result = await db.run(sql, [amount, description, category_id, expense_date]);
      return await repository.findById(result.id);
    } catch (error) {
      throw error;
    }
  },

  findAll: async (query = {}) => {
    try {
      const { categoryId, startDate, endDate, page = 1, limit = 10 } = query;
      const whereClauses = [];
      const params = [];

      if (categoryId) {
        whereClauses.push('e.category_id = ?');
        params.push(categoryId);
      }
      if (startDate) {
        whereClauses.push('e.expense_date >= ?');
        params.push(startDate);
      }
      if (endDate) {
        whereClauses.push('e.expense_date <= ?');
        params.push(endDate);
      }

      const whereSql = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

      const countSql = `
        SELECT COUNT(*) as total
        FROM expenses e
        ${whereSql}
      `;
      const countRow = await db.get(countSql, params);
      const totalRecords = countRow ? countRow.total : 0;

      const offset = (page - 1) * limit;
      const selectSql = `
        SELECT e.id, e.amount, e.description, e.category_id, e.expense_date, e.created_at, e.updated_at,
               c.name as category_name
        FROM expenses e
        LEFT JOIN categories c ON e.category_id = c.id
        ${whereSql}
        ORDER BY e.expense_date DESC, e.id DESC
        LIMIT ? OFFSET ?
      `;

      const recordsParams = [...params, parseInt(limit), parseInt(offset)];
      const records = await db.query(selectSql, recordsParams);
      const totalPages = Math.ceil(totalRecords / limit) || 1;

      return {
        records,
        totalRecords,
        totalPages,
        page: parseInt(page),
        limit: parseInt(limit)
      };
    } catch (error) {
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const sql = `
        SELECT e.id, e.amount, e.description, e.category_id, e.expense_date, e.created_at, e.updated_at,
               c.name as category_name
        FROM expenses e
        LEFT JOIN categories c ON e.category_id = c.id
        WHERE e.id = ?
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

      if (query.id) {
        whereClauses.push('e.id = ?');
        params.push(query.id);
      }
      if (query.category_id) {
        whereClauses.push('e.category_id = ?');
        params.push(query.category_id);
      }

      const whereSql = whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : '';
      const sql = `
        SELECT e.id, e.amount, e.description, e.category_id, e.expense_date, e.created_at, e.updated_at,
               c.name as category_name
        FROM expenses e
        LEFT JOIN categories c ON e.category_id = c.id${whereSql}
      `;
      return await db.get(sql, params);
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const { amount, description, category_id, expense_date } = data;
      const sql = `
        UPDATE expenses
        SET amount = ?, description = ?, category_id = ?, expense_date = ?
        WHERE id = ?
      `;
      await db.run(sql, [amount, description, category_id, expense_date, id]);
      return await repository.findById(id);
    } catch (error) {
      throw error;
    }
  },

  softDelete: async (id) => {
    try {
      const sql = `DELETE FROM expenses WHERE id = ?`;
      const result = await db.run(sql, [id]);
      return result.changes > 0;
    } catch (error) {
      throw error;
    }
  },

  count: async (query = {}) => {
    try {
      const { categoryId, startDate, endDate } = query;
      const whereClauses = [];
      const params = [];

      if (categoryId) {
        whereClauses.push('category_id = ?');
        params.push(categoryId);
      }
      if (startDate) {
        whereClauses.push('expense_date >= ?');
        params.push(startDate);
      }
      if (endDate) {
        whereClauses.push('expense_date <= ?');
        params.push(endDate);
      }

      const whereSql = whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : '';
      const sql = `SELECT COUNT(*) as count FROM expenses${whereSql}`;
      const row = await db.get(sql, params);
      return row ? row.count : 0;
    } catch (error) {
      throw error;
    }
  },

  getSummaryGroupedByCategory: async () => {
    try {
      const sql = `
        SELECT 
          c.name as category,
          COALESCE(c.monthly_budget, 0) as budget,
          COALESCE(SUM(e.amount), 0) as spent,
          (COALESCE(c.monthly_budget, 0) - COALESCE(SUM(e.amount), 0)) as remaining,
          CASE WHEN COALESCE(SUM(e.amount), 0) > COALESCE(c.monthly_budget, 0) THEN 1 ELSE 0 END as overBudget
        FROM categories c
        LEFT JOIN expenses e ON c.id = e.category_id
        GROUP BY c.id
        ORDER BY c.name ASC
      `;
      const rows = await db.query(sql);

      return rows.map(row => ({
        category: row.category,
        budget: Number(row.budget),
        spent: Number(row.spent),
        remaining: Number(row.remaining),
        overBudget: row.overBudget === 1
      }));
    } catch (error) {
      throw error;
    }
  }
};

module.exports = repository;

