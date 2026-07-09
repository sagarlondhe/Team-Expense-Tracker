const expenseRepository = require('../repositories/expense.repository');

module.exports = {
  getSummary: async (req, res, next) => {
    try {
      const summary = await expenseRepository.getSummaryGroupedByCategory();
      res.status(200).json({
        success: true,
        message: 'Spending summary retrieved successfully',
        data: summary
      });
    } catch (err) {
      next(err);
    }
  }
};

