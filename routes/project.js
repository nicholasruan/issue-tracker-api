const router = require('express').Router();
const Project = require('../models/Project');
const User = require('../models/User');
const verify = require('./verifyToken');
const { projectValidation, idValidation } = require('../validation');

router.post('/create', verify, async (req, res) => {
	const {error} = projectValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const proj = new Project({
		title: req.body.title,
		members: req.body.members,
		user_id: req.body.user_id
	});

	try {
		const savedProject = await proj.save();
		const foundUser = await User.findById(req.body.user_id);
		if (!foundUser) return res.status(400).send('User not found');
    const project = await User.updateOne(
      {_id: req.body.user_id},
      {
        $push: {project_ids: savedProject.id}
      }
    );
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

		if (updateProject.n == 0) return res.status(400).send('Project not found');

		res.status(200).send("Project Updated");
	} catch(error) {
		res.status(400).send(error);
	}
});

// - Delete "/api/projects/:id/delete"
router.delete('/:id/delete', verify, async (req, res) => {
	const {error} = idValidation(req.params);
	if (error) return res.status(400).send(error.details[0].message);

	try {
		const deleteProject = await Project.deleteOne({ _id: req.params.id });
		if (deleteProject.n == 0) return res.status(400).send('Project not found');
		res.status(200).send("Project deleted");
	} catch(error) {
		res.status(400).send(error);
	}
});

module.exports = router;
