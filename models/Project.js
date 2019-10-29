const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	members: [String],
	list_ids: [String],
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Project', ProjectSchema);
