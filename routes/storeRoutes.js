const express = require('express');
const controller = require('../controllers/storeController');
const { upload } = require('../middleware/fileUpload');
const { isLoggedIn, isSeller, verifyId } = require('../middlewares/auth');
const router = express.Router();

//GET /store home
router.get('/', controller.index);

//GET /store/items
router.get('/items', controller.items);

//GET /store/new
router.get('/new', isLoggedIn, controller.new);

//POST /store
router.post('/', isLoggedIn, upload, controller.create);

//GET /store/:id
router.get('/:id', verifyId, controller.show);

//GET /store/:id/edit
router.get('/:id/edit', verifyId, isLoggedIn, isSeller, controller.edit);

//PUT /store/:id
router.put('/:id', verifyId, isLoggedIn, isSeller, upload, controller.update);

//DELETE /store/:id
router.delete('/:id', verifyId, isLoggedIn, isSeller, controller.delete);

module.exports = router;