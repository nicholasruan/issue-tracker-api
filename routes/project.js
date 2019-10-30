const router = require('express').Router();
const Project = require('../models/Project');
const List = require('../models/List');
const Card = require('../models/Card');
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
		const foundProject = await Project.findById(req.params.id);
		if (!foundProject) return res.status(400).send('Project not found');
		const listList = foundProject.list_ids;
		for (let i = 0; i < listList.length; i++) {
			const listDocument = await List.findById(listList[i]);
			for (let j = 0; j < listDocument.card_ids.length; j++) {
				let deleteCard = await Card.deleteOne({_id: listDocument.card_ids[j]});
			}
			let deleteList = await List.deleteOne({_id: listDocument._id});
		}

		for (let i = 0; i < foundProject.members.length; i++) {
			const removeProjectFromUser = await User.updateOne(
	      {_id : foundProject.members[i]},
	      { $pull: {project_ids : foundProject._id}}
	    )
		}

		const deleteProject = await Project.deleteOne({ _id: req.params.id });
		res.status(200).send("Project deleted");
	} catch(error) {
		res.status(400).send(error);
	}
});

module.exports = router;
