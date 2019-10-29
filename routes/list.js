const router = require('express').Router();
const List = require('../models/List');
const Project = require('../models/Project');
const verify = require('./verifyToken');
const { listValidation, idValidation } = require('../validation');

router.post('/create', verify, async (req, res) => {
  const {error} = listValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const list = new List({
    title: req.body.title,
    project_id: req.body.project_id
  });

  try {
    const savedList = await list.save();
    const foundProject = await Project.findById(req.body.project_id);
		if (!foundProject) return res.status(400).send('Project not found');
    const project = await Project.updateOne(
      {_id: req.body.project_id},
      {
        $push: {list_ids: savedList.id}
      }
    );
    res.status(200).send({list_id: savedList.id});
  } catch(error) {
    res.status(400).send(error);
  }
});

router.get('/:id', verify, async (req, res) => {
  const {error} = idValidation(req.params);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const foundList = await List.findById(req.params.id);
    if (!foundList) return res.status(400).send('List not found');
    res.send(foundList);
  } catch(error) {
    res.status(400).send(error);
  }
});

router.put('/:id/edit', verify, async (req, res) => {
  const {error} = idValidation(req.params);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const updateList = await List.updateOne({_id: req.params.id},{
      $set: req.body,
    });

    if (updateList.n == 0) return res.status(400).send('List not found');

    res.status(200).send('List Updated');
  } catch(error) {
    res.status(400).send(error);
  }
});

router.delete('/:id/delete', verify, async (req, res) => {
  const {error} = idValidation(req.params);
	if (error) return res.status(400).send(error.details[0].message);

	try {
		const deleteList = await List.deleteOne({ _id: req.params.id });
		if (deleteList.n == 0) return res.status(400).send('List not found');
		res.status(200).send("List deleted");
	} catch(error) {
		res.status(400).send(error);
	}
})

module.exports = router;
