const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movieController');

// Routes
router.get('/', getMovies);
router.post('/', upload.single('image'), createMovie);
router.put('/:id', upload.single('image'), updateMovie);
router.delete('/:id', deleteMovie);

module.exports = router;
