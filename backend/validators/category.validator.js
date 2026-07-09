function validateCategory(req, res, next) {
  const { name, monthly_budget } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Name is required and must be a valid non-empty string.'
    });
  }

  if (monthly_budget !== undefined && monthly_budget !== null) {
    const budgetNum = Number(monthly_budget);
    if (isNaN(budgetNum) || budgetNum < 0) {
      return res.status(400).json({
        success: false,
        message: 'Monthly budget must be a non-negative number.'
      });
    }
  }

  // Sanitize name
  req.body.name = name.trim();
  req.body.monthly_budget = monthly_budget !== undefined && monthly_budget !== null ? Number(monthly_budget) : null;

  next();
}

module.exports = {
  validateCategory
};
