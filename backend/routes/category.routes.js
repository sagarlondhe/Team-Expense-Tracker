const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { validateCategory } = require('../validators/category.validator');
const { validateId } = require('../validators/expense.validator');

router.post('/', validateCategory, categoryController.create);
router.get('/', categoryController.getAll);
router.get('/:id', validateId, categoryController.getById);
router.put('/:id', validateId, validateCategory, categoryController.update);
router.delete('/:id', validateId, categoryController.delete);

module.exports = router;
