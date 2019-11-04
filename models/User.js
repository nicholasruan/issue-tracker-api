const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
		required: true,
		max: 255,
		min: 6
	},
	password: {
		type: String,
		max: 1024,
		min: 6
	},
	date: {
		type: Date,
		default: Date.now
	},
	project_ids: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model('User', UserSchema);
