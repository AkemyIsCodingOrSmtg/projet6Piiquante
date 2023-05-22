const SauceModel = require('../schemas/SauceSchema');
const { logger } = require('../helpers/log4js');
const { Types } = require('mongoose');

class SauceController {

    async getSauces(req, res) {
        try {
            logger.info("Get sauces");
            const sauces = await SauceModel.find();
            return res.status(201).json(sauces);
        } catch (ex) {
            logger.error("An error occurred trying to get the sauces. Reason : " + ex);
            throw new Error(ex);
        }
    }

    async getSauce(req, res) {
        try {
            logger.info("Get sauce");
            const sauce = await SauceModel.findById(req.params.id);
            return res.status(201).json(sauce);
        } catch (ex) {
            logger.error("An error occurred trying to get the sauce. Reason : " + ex);
            throw new Error(ex);
        }
    }

    async createSauce(req, res) {
        try {

            const data = req.body;

            if (!data) {
                return res.status(401).json({ message: 'There is no data in the body of the request' });
            }

            const sauce = JSON.parse(data['sauce']);
            const image = req.file;

            if (!image) {
                return res.status(401).json({ message: 'One picture is mandatory for this form' });
            }
            Object.assign(sauce, { imageUrl: `http://localhost:${process.env.PORT}/${image.path}` });

            await SauceModel.create(sauce);

            return res.status(201).json({ message: 'Sauce created successfully' });
        } catch (ex) {
            logger.error("An error occurred trying to create one sauce. Reason : " + ex);
            throw new Error(ex);
        }
    }

    async updateSauce(req, res) {
        try {
            const sauce = req.body;
            const idSauce = req.params.id;

            if (!sauce) {
                return res.status(401).json({ message: 'There is no data in the body of the request' });
            }

            // Si une nouvelle image est chargée, on l'a rajoute
            if (req.file) {
                Object.assign(sauce, { imageUrl: `http://localhost:${process.env.PORT}/${req.file.path}` });
            }

            const existingSauce = await SauceModel.findById(req.params.id);

            if (existingSauce.userId !== sauce.userId) {
                return res.status(403).json({ message: 'You don\'t have enough permissions to do that. You are not the owner of the sauce' });
            }

            const result = await SauceModel.updateOne({ _id: idSauce }, sauce);

            return res.status(201).json({ message: 'Sauce updated successfully', result });

        } catch (ex) {
            logger.error("An error occurred trying to edit one sauce. Reason : " + ex);
            throw new Error(ex);
        }
    }

    async deleteSauce(req, res) {
        try {
            logger.info("Delete sauces");
            const idSauceToDelete = req.params.id;

            const hasBeenDeleted = await SauceModel.deleteOne({ _id: idSauceToDelete });

            if (!hasBeenDeleted) {
                logger.warn("Nothing to delete !");
                return res.status(401).json({ message: "Nothing to delete !" });
            }
            return res.status(200).json({ message: "Sauce deleted" });
        } catch (ex) {
            logger.error("An error occurred trying to delete one sauce. Reason : " + ex);
            throw new Error(ex);
        }
    }

    async ManageLike(req, res) {
        try {
            const idSauce = req.params.id;
            const userId = req.body.userId;
            const like = req.body.like;

            /**
             * Si like = 1, l'utilisateur aime (= like) la sauce.
             * Si like = 0, l'utilisateur annule son like ou son dislike. 
             * Si like = -1, l'utilisateur n'aime pas (=dislike) la sauce. 
             */
            switch (like) {
                case Number("-1"):
                    console.log("Like is -1");
                    const updatedDislike = await SauceModel.updateOne(
                        {
                            _id: idSauce
                        },
                        {
                            $inc:
                            {
                                dislikes: 1
                            }, $push:
                            {
                                usersDisliked: Types.ObjectId(userId)
                            }
                        }
                    );
                    console.log(updatedDislike);
                    return res.status(200).json({ message: "Like added" });

                case Number("0"):
                    console.log("Like is 0");

                    const isNoMoreLiked = await SauceModel.findOneAndUpdate(
                        {
                            _id: idSauce,
                            usersLiked: Types.ObjectId(userId)
                        },
                        {
                            $pull: {
                                usersLiked: Types.ObjectId(userId)
                            }, $inc: {
                                likes: -1
                            }
                        });
                    console.log('isNoMoreLiked');
                    console.log(isNoMoreLiked);

                    const isNoMoreDisliked = await SauceModel.findOneAndUpdate({ _id: idSauce, usersDisliked: Types.ObjectId(userId) }, { $pull: { usersDisliked: Types.ObjectId(userId) }, $inc: { dislikes: -1 } });
                    console.log('isNoMoreDisliked');
                    console.log(isNoMoreDisliked);

                    return res.status(200).json({ message: "Like/Dislike cancelled" });

                case Number("1"):
                    console.log("Like is 1");
                    const updatedLike = await SauceModel.updateOne({ _id: idSauce }, { $inc: { likes: 1 }, $push: { usersLiked: Types.ObjectId(userId) } });
                    console.log(updatedLike);
                    return res.status(200).json({ message: "Like added" });

                default:
                    return res.status(401).json({ message: "Unknown value. Need to be -1, 0, or 1 as Number" });


            }

            return res.status(201).json({ message: "Management of like has been done correctly" });
        } catch (ex) {
            logger.error("An error occurred trying to add one like to the sauce. Reason : " + ex);
            throw new Error(ex);
        }
    }

}

module.exports = SauceController;