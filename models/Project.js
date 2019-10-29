const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	members: [mongoose.Schema.Types.ObjectId],
	list_ids: [mongoose.Schema.Types.ObjectId],
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Project', ProjectSchema);
