const jwt = require('jsonwebtoken');
const { logger } = require('../helpers/log4js');

function jwtMiddleware(req, res, next) {
    try {
        const authHeader = req.headers["authorization"] || '';
        const token = authHeader.split(' ')[1];
        
        logger.trace("TOKEN : " + token);

        if (!token) return res.status(401).json({message: 'Not token provided'});

        jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
            if (error) {
                return res.status(403).json({message: 'Incorrect or invalid token ' + error});
            }
            next();
        })
    } catch(e) {
        logger.error("An error occured trying to verify the Token. Reason : " + e);
    }
}
module.exports = jwtMiddleware;