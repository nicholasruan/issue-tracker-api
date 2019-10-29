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
	list_id : {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	assigned: [String],
	tags: [String],
	due_date: {
		type: Date
	}
});

module.exports = mongoose.model('Card', CardSchema);
