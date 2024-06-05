const e = require('express');
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
	rental_id: {
		type: String,
		required: true,
		unique: true
	},
    customer_id: {
        type: String,
        required: true
    },
    movie_id: {
        type: String,
        required: true
    },
	rental_date: {
        type: Date,
        required: true
    },
    return_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    }   
	});

	const Rental = mongoose.model('Rental', rentalSchema);
	module.exports = Rental;