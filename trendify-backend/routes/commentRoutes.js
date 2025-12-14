const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const commentController = require('../controllers/commentController');

router.post('/:externalId', auth, commentController.addComment);
router.get('/:externalId', commentController.getComments);

module.exports = router;
