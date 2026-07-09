const Repository = require('../repositories/expense.repository');

module.exports = {
  create: async (req, res) => {
    try {
      const { amount, description, category_id, expense_date } = req.body;
      const result = await Repository.create({ amount, description, category_id, expense_date });

      return res.status(201).json({
        success: true,
        message: 'Expense recorded successfully',
        data: result
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const { category, startDate, endDate, page = 1, limit = 10 } = req.query;
      const parsedPage = parseInt(page);
      const parsedLimit = parseInt(limit);

      if (isNaN(parsedPage) || parsedPage <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Page parameter must be a positive integer.'
        });
      }

      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Limit parameter must be a positive integer.'
        });
      }

      const result = await Repository.findAll({
        categoryId: category ? Number(category) : null,
        startDate: startDate || null,
        endDate: endDate || null,
        page: parsedPage,
        limit: parsedLimit
      });

      return res.status(200).json({
        success: true,
        message: 'Expenses retrieved successfully',
        data: result.records,
        pagination: {
          page: result.page,
          limit: result.limit,
          totalRecords: result.totalRecords,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      });
    }
  },

  getById: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const result = await Repository.findById(id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: `Expense with ID ${id} not found.`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Expense retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      });
    }
  },

  update: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { amount, description, category_id, expense_date } = req.body;
      const expense = await Repository.findById(id);

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: `Expense with ID ${id} not found.`
        });
      }

      const result = await Repository.update(id, { amount, description, category_id, expense_date });

      return res.status(200).json({
        success: true,
        message: 'Expense updated successfully',
        data: result
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      });
    }
  },

  delete: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const expense = await Repository.findById(id);

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: `Expense with ID ${id} not found.`
        });
      }

      await Repository.softDelete(id);

      return res.status(200).json({
        success: true,
        message: 'Expense deleted successfully',
        data: {}
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      });
    }
  },
};

