const repo = require('../repositories/category.repository');

module.exports = {
  create: async (req, res) => {
    try {
      const { name, monthly_budget } = req.body;
      const existing = await repo.findOne({ name });

      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'A category with this name already exists.'
        });
      }

      const result = await repo.create({ name, monthly_budget });

      return res.status(201).json({
        success: true,
        message: 'Category created successfully',
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
      const result = await repo.findAll();

      return res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
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

  getById: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const result = await repo.findById(id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: `Category with ID ${id} not found.`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Category retrieved successfully',
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
      const { name, monthly_budget } = req.body;
      const category = await repo.findById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: `Category with ID ${id} not found.`
        });
      }

      const existing = await repo.findOne({ name });
      if (existing && existing.id !== id) {
        return res.status(409).json({
          success: false,
          message: 'A category with this name already exists.'
        });
      }

      const result = await repo.update(id, { name, monthly_budget });

      return res.status(200).json({
        success: true,
        message: 'Category updated successfully',
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
      const category = await repo.findById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: `Category with ID ${id} not found.`
        });
      }

      const expenseCount = await repo.countExpenses(id);
      if (expenseCount > 0) {
        return res.status(409).json({
          success: false,
          message: 'Category contains expenses and cannot be deleted.'
        });
      }

      await repo.softDelete(id);

      return res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
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

