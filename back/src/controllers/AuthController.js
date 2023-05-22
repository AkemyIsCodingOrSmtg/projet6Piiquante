"use strict";
const { logger } = require('../helpers/log4js');
const UserModel = require('../schemas/UserSchema');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserModel.findOne({ email });

            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            const match = await bcrypt.compare(password, user.password);
            
            if (!match) {
                return res.status(401).json({ message: "Incorrect credentials"});
            }

            const token = await jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: '15m'});

            return res.status(200).json({ message: "Credentials correct, connect to the application ...", token, userId: user._id});

        } catch (e) {
            logger.error("An error occurred trying to login. Reason : " + e);
            return res.status(500).json({ message: "An error occurred trying to login. Reason : " + e })
        }

    }

    async signup(req, res) {
        try {
            const { email, password } = req.body;
            

            const salt = 10;
            bcrypt.hash(password, salt)
                .then(async (hash) => {

                    // To test the middleware, switch the 46 and 47 comments
                    const newUser = await UserModel.create({email, password: hash});
                    // const newUser = await UserModel.create({email, password: null});

                    // USING THE MONGOOSE UNIQUE VALIDATION SAVE CHECK
                    newUser.save(function(err) {
                        logger.error(err); // CONSOLE LOG ERROR IF VALIDATIONERROR DETECTED
                    })


                    if (!newUser) {
                        return res.status(500).json({message: "An error occured trying to create the user in the DB !"});
                    }

                    logger.info("User created ! ");
                    return res.status(200).json({message: "A new user has been succesfully created", newUser});
                })
                .catch(error => {
                    logger.error("An error occurred trying to hash the password. Reason : " + error);
                    return res.status(500).json({message: "An error occurred trying to hash the password"});
                });
        } catch (e) {
            logger.error("An error occurred trying to signup. Reason : " + e);
            return res.status(500).json({ message: "An error occurred trying to signup. Reason : " + e })
        }
    }

}

module.exports = AuthController;