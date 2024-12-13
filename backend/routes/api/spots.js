const express = require('express');

const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

//! GET ALL SPOTS W/QUERY PARAMS

router.get("/", async (req, res, next) => {
    try {
        const {
            page = 1,
            size = 20,
            minLat,
            maxLat,
            minLng,
            maxLng,
            minPrice,
            maxPrice
        } = req.query; // extract query parameters from req.query

        // apply pagination with default values and validate them
        const pagination = {};

        //! test

        const errors = {};

        if (parseInt(page, 10) >= 1 && parseInt(size, 10) >= 1 && parseInt(size, 10) <= 20) {
            pagination.limit = parseInt(size, 10);
            pagination.offset = (parseInt(page, 10) - 1) * parseInt(size, 10);
        } else {
            errors.page = "Page must be greater than or equal to 1";
            errors.size = "Size must be between 1 and 20";
        }

        // Apply filters (lat, long, price) if provided and valid
        const where = {};

        if (minLat && (isNaN(minLat) || minLat < -90 || minLat > 90)) {
            errors.minLat = "minLat must be a number between -90 and 90";
        } else if (minLat) {
            where.lat = { [Op.gte]: parseFloat(minLat) };
        }

        if (maxLat && (isNaN(maxLat) || maxLat < -90 || maxLat > 90)) {
            errors.maxLat = "maxLat must be a number between -90 and 90";
        } else if (maxLat) {
            where.lat = { ...where.lat, [Op.lte]: parseFloat(maxLat) };
        }

        if (minLng && (isNaN(minLng) || minLng < -180 || minLng > 180)) {
            errors.minLng = "minLng must be a number between -180 and 180";
        } else if (minLng) {
            where.lng = { [Op.gte]: parseFloat(minLng) };
        }

        if (maxLng && (isNaN(maxLng) || maxLng < -180 || maxLng > 180)) {
            errors.maxLng = "maxLng must be a number between -180 and 180";
        } else if (maxLng) {
            where.lng = { ...where.lng, [Op.lte]: parseFloat(maxLng) };
        }

        if (minPrice && (isNaN(minPrice) || minPrice < 0)) {
            errors.minPrice = "minPrice must be a number greater than or equal to 0";
        } else if (minPrice) {
            where.price = { [Op.gte]: parseFloat(minPrice) };
        }

        if (maxPrice && (isNaN(maxPrice) || maxPrice < 0)) {
            errors.maxPrice = "maxPrice must be a number greater than or equal to 0";
        } else if (maxPrice) {
            where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };
        }

        // If there are validation errors, return them
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Bad Request",
                errors
            });
        }

        // use spot.findAll() with the 'where' clause and 'pagination' applied.
        const spots = await Spot.findAll({
            include: [
                { model: Review, attributes: ['stars'] },
                { model: SpotImage, attributes: ['url', 'preview'] }
            ],
            where,
            ...pagination
        });

        const spotList = spots.map(spot => {

            const spotData = spot.toJSON();

            const avgRating = spotData.Reviews && spotData.Reviews.length > 0
            ? spotData.Reviews.reduce((acc, review) => acc + review.stars, 0) / spotData.Reviews.length
            : 0;

            const previewImage = spotData.SpotImages.find((image) => image.preview)
            ? spotData.SpotImages.find((image) => image.preview).url
            : null;

            delete spotData.SpotImages;

            delete spotData.Reviews;

            return {
                ...spotData,
                lat: parseFloat(spotData.lat), // cast to number
                lng: parseFloat(spotData.lng), // cast to number
                price: parseFloat(spotData.price), // cast to number
                avgRating,
                previewImage
            };
        });

        // also, include pagination data in the response
        res.status(200).json({ Spots: spotList, page: parseInt(page, 10), size: parseInt(size, 10) });

    } catch (err) {
        next(err);
    }
});

//! GET ALL SPOTS OWNED BY THE CURRENT USER

router.get('/current', requireAuth, async (req, res, next) => {

    // Get the current user

    const userId = req.user.id;

    try {

        // Get the spots belonging to the current user

        const spots = await Spot.findAll({

            where: {
                ownerId: userId
            },

            include: [
                {
                    model: Review,
                    attributes: ['stars']
                },
                {
                    model: SpotImage,
                    attributes: ['url']
                }
            ]
        });

        // Map through each spot, calculate avgRating and fetch previewImage

        const spotList = spots.map(spot => {

            const spotData = spot.toJSON();

            const avgRating = spotData.Reviews && spotData.Reviews.length > 0

                ? spotData.Reviews.reduce((acc, review) => acc + review.stars, 0) / spotData.Reviews.length

                : 0;

            const previewImage = spot.SpotImages[0] ? spot.SpotImages[0].url : null;

            delete spotData.SpotImages;
            delete spotData.Reviews

            // combine each spot with avgRating and previewImage to create spotDetails

            return {
                ...spotData,
                avgRating,
                previewImage
            };
        });

        // return spotDetails as a json response

        res.json({ Spots: spotList })

    } catch (err) {
        next(err);
    };
});

//! GET DETAILS OF A SPOT FROM AN ID

router.get('/:spotId', async (req, res, next) => {

    try {

        const id = req.params.spotId; // destructure the request parameters to extract the spotId

        const spot = await Spot.findByPk(id, { // Here we search for a specific spot using its id (which is its primary key, hence the .findByPk method)

            include: [ // We also want to include the Review and SpotImage models in our query because we need the 'stars' attribute of the Reviews corresponding to this spot as well as the 'url' of the first SpotImage corresponding to this spot in order to calculate the avgRating and determine the previewImage for the spot.
                {
                    model: Review,
                    attributes: ['stars']
                },
                {
                    model: SpotImage,
                    attributes: ['id', 'url', 'preview']
                },
                {
                    model: User,
                    as: "Owner",
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        });

        if (!spot) { // If the spot does not exist...
            return res.status(404).json({ message: "Spot couldn't be found" }); // ...return a json response with the message "Spot couldn't be found" and an error code of 404, per the API documentation
        }

        // console.log(spot); //! For testing

        const spotData = spot.toJSON(); // convert our spot into a POJO

        const avgStarRating = spotData.Reviews && spotData.Reviews.length > 0 // Check to see if Reviews exists and make sure that it isn't empty

            ? spotData.Reviews.reduce((acc, review) => acc + review.stars, 0) / spotData.Reviews.length // If there are reviews, we use the reduce method to add up all of the stars from all of the reviews corresponding to the current spot, then divide that number by the total number of reviews in order to get the average rating.

            : 0; // If there are not reviews, then we set the average rating to 0.


        const numReviews = spotData.Reviews.length;

        delete spotData.Reviews;

        const spotDetails = { // Use the spread operator to include all of the properties from our spotData (the details of the current spot) into our new object, 'spotDetails'
            ...spotData,
            numReviews,
            avgStarRating, // then we add the avgStarRating and previewImage properties to our new 'spotDetails' object as well
            // previewImage
        };

        res.json(spotDetails) // Finally, we return the spotDetails as a JSON response

    } catch (err) { // We also wrapped our code in a try-catch block so that we can handle any errors that occur and pass them to the next() error-handler.
        next(err)
    }
});

//! Create a Spot

const validateSpot = [
    check('address')
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .notEmpty()
        .withMessage('Latitude is required')
        // .bail()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .notEmpty()
        .withMessage('Longitude is required')
        // .bail()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be within -180 and 180'),
    check('name')
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .notEmpty()
        .withMessage('Price cannot be empty')
        .isFloat({ gt: 0 })
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
];

//! Create A Spot

router.post("/", requireAuth, validateSpot, async (req, res, next) => {

    try {

        const ownerId = req.user.id;

        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        // res.json(req.body); //! For testing

        const newSpot = await Spot.create({
            ownerId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        });

        // const spot = await Spot.findByPk(newSpot.id);
        const spot = await Spot.findOne({
            where: {
                id: newSpot.id
            }
        })

        res.status(201).json(spot);

    } catch(err) {
        next(err);
    };
});

//! Add an Image to a Spot by the Spot's ID

router.post('/:spotId/images', requireAuth, async (req,res,next) => {

    try{

        const userId = req.user.id;
        const spotId = req.params.spotId;
        const spot = await Spot.findByPk(spotId);

        console.log(spot);

        if (!spot) {
            return res.status(404).json({
                message:"Spot couldn't be found"
            })
        }

        if (spot.ownerId !== userId) {
            return res.status(403).json({
                message:"Unauthorized"
            })
        }

        const { url, preview } = req.body;

        const newSpotImage = await SpotImage.create({

            spotId: spotId,
            url,
            preview

        })

        res.status(201).json(newSpotImage)
    } catch(err){
        next(err)
    }
})

//! Edit Spot

router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        const userId = req.user.id;
        // const spot = await Spot.findByPk(spotId);

        const spot = await Spot.findOne({
            where: {
                id: spotId
            }
        });

        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        if (spot.ownerId !== userId) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        Object.assign(spot, { address, city, state, country, lat, lng, name, description, price });

        await spot.save();

        res.json(spot);
    }
    catch(err){
        next(err)
    }
})

//! Delete A Spot

router.delete('/:spotId',requireAuth,async(req,res,next)=>{
    try{
        const spotId = req.params.spotId;
        const userId = req.user.id;

        const spot = await Spot.findByPk(spotId);
        if(!spot){
            return res.status(404).json({
                message:"Spot couldn't be found"
            })
        }
        if(spot.ownerId !== userId){
            return res.status(403).json({
                message:"Unauthorized"
            })
        }

        await SpotImage.destroy({ where: { spotId: spotId } });
        await Booking.destroy({ where: { spotId: spotId } });

        // Find all reviews for the spot
        const reviews = await Review.findAll({ where: { spotId: spotId } });

        // Delete associated ReviewImage records for each review
        for (const review of reviews) {
            await ReviewImage.destroy({ where: { reviewId: review.id } });
        }

         // Now delete the Review records
        await Review.destroy({ where: { spotId: spotId } });

        await spot.destroy();

       res.status(200).json({
        message:"Successfully deleted"
       })

    }
    catch(err){
        next(err)
    }
})

//! Get All Reviews by a Spot's ID

router.get('/:spotId/reviews', async (req, res, next) => {

    try {

        const spotId = req.params.spotId;

        // const spot = await Spot.findByPk(spotId);
        const spot = await Spot.findOne({
            where: {
                id: spotId
            }
        })

        if (!spot) {
            res.status(404).json({ message: "Spot couldn't be found" })
        }

        const reviews = await Review.findAll({
            where: {
                spotId: spotId
            },

            include: [
                { model: User, attributes: ['id', 'firstName', 'lastName'] },
                { model: ReviewImage, attributes: ['id', 'url'] }
            ]
        });

        res.status(200).json({Reviews: reviews});

    } catch (err) {
        next(err)
    }
});

//! Create a Review for a Spot based on the Spot's ID

const validateReview = [
    check('review').notEmpty().withMessage('Review text is required'),
    check('stars').isInt({ min: 1, max: 5 }).withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors // Middleware for validation error handling
];

router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {

    try {

        const userId = req.user.id;

        const spotId = req.params.spotId;

        // const spot = await Spot.findByPk(spotId);
        const spot = await Spot.findOne({
            where: {
                id: spotId
            }
        })

        if (!spot) {
            return res.status(404).json({message: "Spot couldn't be found"})
        }

        let existingReview = await Review.findOne({
            where: {
                userId: userId,
                spotId: spotId
            }
        })

        if (existingReview) {
            return res.status(500).json({ message: "User already has a review for this spot" });
        }

        const { review, stars } = req.body


        const newReview = await Review.create({
            spotId: spotId,
            userId: userId,
            review,
            stars
        });

        res.status(201).json(newReview)

    } catch(err) {
        next(err)
    }
})

module.exports = router;
