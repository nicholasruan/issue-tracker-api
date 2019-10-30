const router = require('express').Router();
const List = require('../models/List');
const Card = require('../models/Card');
const verify = require('./verifyToken');
const { cardValidation, idValidation } = require('../validation');

router.post('/create', verify, async (req, res) => {
  const {error} = cardValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const card = new Card({
    name: req.body.name,
    created_by: req.body.created_by,
    list_id: req.body.list_id
  });

  try {
    const savedCard = await card.save();
    const foundList = await List.findById(req.body.list_id);
		if (!foundList) return res.status(400).send('List not found');
    const project = await List.updateOne(
      {_id: req.body.list_id},
      {
        $push: {card_ids: savedCard.id}
      }
    );
    res.status(200).send({card_id: savedCard.id});
  } catch(error) {
    res.status(400).send(error);
  }
});

router.get('/:id', verify, async (req, res) => {
  const {error} = idValidation(req.params);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const foundCard = await Card.findById(req.params.id);
    if (!foundCard) return res.status(400).send('Card not found');
    res.send(foundCard);
  } catch(error) {
    res.status(400).send(error);
  }
});

router.put('/:id/edit', verify, async (req, res) => {
  const {error} = idValidation(req.params);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const updateCard = await Card.updateOne({_id: req.params.id},{
      $set: req.body,
    });

    if (updateCard.n == 0) return res.status(400).send('Card not found');

    res.status(200).send('Card Updated');
  } catch(error) {
    res.status(400).send(error);
  }
});

router.delete('/:id/delete', verify, async (req, res) => {
  const {error} = idValidation(req.params);
	if (error) return res.status(400).send(error.details[0].message);

	try {
    const foundCard = await Card.findById(req.params.id);
    if (!foundCard) return res.status(400).send('List not found');

    const removeCardfromList = await List.updateOne(
      {_id : foundCard.list_id},
      { $pull: {card_ids : foundCard._id}}
    )

		const deleteCard = await Card.deleteOne({ _id: req.params.id });
    
		res.status(200).send("Card deleted");
	} catch(error) {
		res.status(400).send(error);
	}
})

module.exports = router;
