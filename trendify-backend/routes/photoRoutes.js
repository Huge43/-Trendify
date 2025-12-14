const express = require('express');
const router = express.Router();
const controller = require('../controllers/photoController');
const auth = require('../middleware/authMiddleware');

router.get('/', controller.getPhotos);
router.post('/', auth, controller.addPhoto);
router.get('/unsplash', controller.getUnsplashPhotos);

module.exports = router;
