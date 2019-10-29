const router = require('express').Router();
const Project = require('../models/Project');
const verify = require('./verifyToken');

router.post('/create', verify, async (req, res) => {
	const proj = new Project({
		title: req.body.title,
		members: req.body.members
	});

	try {
		const savedProject = await proj.save();
		res.status(200).send({proj_id: savedProject.id});
	} catch(error) {
		res.status(400).send(error);
	}
})

module.exports = router;
