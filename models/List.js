const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	card_ids: [String],
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('List', ListSchema);
