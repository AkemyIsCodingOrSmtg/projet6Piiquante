const Joi = require('joi'); 

const authLoginValidator = Joi.object({
    email: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'fr', 'net']}}).required(),
    password: Joi.string().required()
});

module.exports = authLoginValidator;