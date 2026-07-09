const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const { validateExpense, validateId } = require('../validators/expense.validator');

router.post('/', validateExpense, expenseController.create);
router.get('/', expenseController.getAll);
router.get('/:id', validateId, expenseController.getById);
router.put('/:id', validateId, validateExpense, expenseController.update);
router.delete('/:id', validateId, expenseController.delete);

module.exports = router;
