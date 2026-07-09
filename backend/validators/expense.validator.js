const categoryRepository = require('../repositories/category.repository');

async function validateExpense(req, res, next) {
  const { amount, description, category_id, expense_date } = req.body;

  if (amount === undefined || amount === null || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Amount is required and must be a positive number greater than 0.'
    });
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Description is required.'
    });
  }

  if (category_id === undefined || category_id === null || isNaN(Number(category_id))) {
    return res.status(400).json({
      success: false,
      message: 'Category is required and must be a valid ID.'
    });
  }

  if (!expense_date || isNaN(Date.parse(expense_date))) {
    return res.status(400).json({
      success: false,
      message: 'Expense Date is required and must be a valid date.'
    });
  }

  // Regex check for basic YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(expense_date)) {
    return res.status(400).json({
      success: false,
      message: 'Expense Date must be in YYYY-MM-DD format.'
    });
  }

  try {
    const category = await categoryRepository.findById(Number(category_id));
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. The specified category does not exist.'
      });
    }
  } catch (err) {
    return next(err);
  }

  // Parse and sanitize fields
  req.body.amount = Number(amount);
  req.body.description = description.trim();
  req.body.category_id = Number(category_id);
  req.body.expense_date = expense_date;

  next();
}

function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID. Must be a positive integer.'
    });
  }
  next();
}

module.exports = {
  validateExpense,
  validateId
};
