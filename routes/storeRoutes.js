const express = require('express');
const router = express.Router();
const controller = require('../controllers/storeController');
const { upload } = require('../middleware/fileUpload');

//GET /store home
router.get('/', controller.index);

//GET /store/items
router.get('/items', controller.items);

//GET /store/new
router.get('/new', controller.new);

// //POST /store
router.post('/', upload, controller.create);

// //GET /store/:id
router.get('/:id', controller.show);

// //GET /store/:id/edit
router.get('/:id/edit', controller.edit);

// //PUT /store/:id
router.put('/:id', upload, controller.update);

// //DELETE /store/:id
router.delete('/:id', controller.delete);

module.exports = router;