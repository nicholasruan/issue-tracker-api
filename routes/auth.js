const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation');

// Register User
router.post('/register', async (req, res) => {
	const {error} = registerValidation(req.body);

	if (error) return res.status(400).send(error.details[0].message);

	// Check if user is already in DB
	const emailExists = await User.findOne({ email: req.body.email });

	if (emailExists) return res.status(400).send('User already exists');

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);

	const user = new User({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: hashPassword
	});

	try {
		const savedUser = await user.save();
		res.status(200).send({user: savedUser.id});
	} catch(error) {
		res.status(400).send(error);
	}

});

// Login User
router.post('/login', async (req, res) => {
	const {error} = loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send('Email or password is wrong');

	// Is Password Correct
	const validPass = await bcrypt.compare(req.body.password, user.password);

	if (!validPass) return res.status(400).send('Email or password is wrong');

	// Create and assign token
	const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);

	res.header('auth-token', token).send({user_token: token, _id: user._id});
})

module.exports = router;
