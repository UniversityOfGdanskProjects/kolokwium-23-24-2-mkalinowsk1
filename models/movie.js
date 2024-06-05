const e = require('express');
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
	movie_id: {
		type: String,
		required: true,
		unique: true
	},
	title: {
		type: String,
		required: true
	},
	director: {
		type: String,
		required: true
	},
	genre: {
		type: String,
		required: true
	},
	release_year: {
		type: Number,
		required: true
	},
    rating: {
        type: Number,
        required: true
    }
	});

	const Movie = mongoose.model('Movie', movieSchema);
	module.exports = Movie;