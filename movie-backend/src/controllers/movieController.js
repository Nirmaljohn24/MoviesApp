const Movie = require('../models/Movie');

// GET all movies (with pagination)
exports.getMovies = async (req, res) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const skip = (page - 1) * limit;

    const docs = await Movie.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Movie.countDocuments();

    res.json({
      data: docs,
      page,
      limit,
      total,
      hasMore: skip + docs.length < total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST create new movie
exports.createMovie = async (req, res) => {
  try {
    const movieData = req.body;
    if (req.file) {
      movieData.image = `/uploads/${req.file.filename}`;
    }

    const movie = new Movie(movieData);
    const saved = await movie.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// PUT update movie
exports.updateMovie = async (req, res) => {
  try {
    const movieData = req.body;
    if (req.file) {
      movieData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Movie.findByIdAndUpdate(req.params.id, movieData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// DELETE movie
exports.deleteMovie = async (req, res) => {
  try {
    const removed = await Movie.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
