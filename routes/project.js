const router = require('express').Router();
const Project = require('../models/Project');
const verify = require('./verifyToken');
const { projectValidation, idValidation } = require('../validation');

router.post('/create', verify, async (req, res) => {
	const {error} = projectValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

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
});

router.get('/:id', verify, async (req, res) => {
	const {error} = idValidation(req.params);
	if (error) return res.status(400).send(error.details[0].message);

	try {
		const foundProject = await Project.findById(req.params.id);
		if (!foundProject) return res.status(400).send('Project not found');
		res.send(foundProject);
	} catch(error) {
		res.status(400).send(error);
	}
});

// - Edit "/api/projects/:id/edit"
router.put('/:id/edit', verify, async (req,res) => {
	const {error} = idValidation(req.params);
	if (error) return res.status(400).send(error.details[0].message);
	try {
		const updateProject = await Project.updateOne({ _id: req.params.id},
		{
			$set: req.body,
		});

		res.send(updateProject);
	} catch(error) {
		res.status(400).send(error);
	}
});


// - Delete "/api/projects/:id/delete"

module.exports = router;
