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

const projectValidation = (data) => {
	const schema = Joi.object({
		title: Joi.string().required(),
	});

	return schema.validate(data);
}

// MongoDB id validation
const idValidation = (data) => {
	const schema = Joi.object({
		id: Joi.string().min(24).max(24).required()
	});

	return schema.validate(data);
}

const listValidation = (data) => {
	const schema = Joi.object({
		title: Joi.string().required(),
		project_id: Joi.string().min(24).max(24).required()
	});

	return schema.validate(data);
}

const cardValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().required(),
		created_by: Joi.string().required(),
		list_id: Joi.string().min(24).max(24).required()
	});

	return schema.validate(data);
}

module.exports = {
	registerValidation: registerValidation,
	loginValidation: loginValidation,
	projectValidation: projectValidation,
	idValidation: idValidation,
	listValidation: listValidation,
	cardValidation: cardValidation
};
