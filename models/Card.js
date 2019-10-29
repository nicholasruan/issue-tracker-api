const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	created_by: {
		type: String,
		required: true,
	},
	priority: {
		type: String
	},
	description: {
		type: String
	},
	assigned: [String],
	tags: [String],
	due_date: {
		type: Date
	}
});

module.exports = mongoose.model('Card', CardSchema);
