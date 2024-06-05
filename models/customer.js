const e = require('express');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
	customer_id: {
		type: String,
		required: true,
		unique: true
	},
	first_name: {
		type: String,
		required: true
	},
	last_name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
    phone_number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: { 
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip_code: {
        type: String,
        required: true
    },
    membership_date: {
        type: Date,
        required: true
    }
	});

	const Customer = mongoose.model('Customer', customerSchema);
	module.exports = Customer;