const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	project_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	card_ids: [mongoose.Schema.Types.ObjectId],
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('List', ListSchema);
