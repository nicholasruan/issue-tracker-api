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

module.exports = router;
