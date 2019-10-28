// Validation
const Joi = require('@hapi/joi');

// register validation
const registerValidation = (data) => {
	const schema = Joi.object({
		first_name: Joi.string().min(2).required(),
		last_name: Joi.string().min(2).required(),
		email: Joi.string().min(4).required().email(),
		password: Joi.string().min(6).required()
	});

	return schema.validate(data);
};

const loginValidation = (data) => {
	const schema = Joi.object({
		email: Joi.string().min(4).required().email(),
		password: Joi.string().min(6).required()
	});

	return schema.validate(data);
};

module.exports = {
	registerValidation: registerValidation,
	loginValidation: loginValidation
};
