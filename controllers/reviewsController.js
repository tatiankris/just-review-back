import Review from "../models/Review.js";
import User from "../models/User.js";

class reviewsController {
    async all (req, res) {
        try {
            ///Посмотреть как получили PACKS неужели запрашиваем всех сразу??
            const reviews = await Review.find()
            return res.json(reviews);
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Failed to get reviews"})
        }
    }
    async author (req, res) {
        try {
            const reviews = await Review.find({user: req.user._id})
            return res.json(reviews);
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Failed to get author's reviews"})
        }
    }

    async createReview (req, res) {
        try {
            const _id = req.user._id
            // console.log('id:', _id)

            const user = await User.findOne({_id})
            // console.log('user:', user)
            if (!user) {
                return res.status(400).json({message: 'User not found'})
            }

            const {reviewTitle, workTitle, reviewText, category, tags, authorGrade} = req.body
            const review = new Review({user: user._id, reviewTitle, workTitle, reviewText, category, tags, authorGrade})
            // console.log('review:', review)
            await review.save()

            return res.json({message: 'Review created successfully ', review})


        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Add review error"})
        }
    }
    async updateReview (req, res) {
        try {
            const _id = req.user._id
            // console.log('id:', _id)

            const user = await User.findOne({_id})
            // console.log('user:', user)
            if (!user) {
                return res.status(400).json({message: 'User not found'})
            }
            const {reviewId, reviewTitle, workTitle, reviewText, category, tags, authorGrade} = req.body
            const review = await Review.findOne({_id: reviewId})
            if (!review) {
                return res.status(400).json({message: 'Review not found'})
            }

            await Review.findOneAndUpdate({_id: reviewId}, {reviewTitle, workTitle, reviewText, category, tags, authorGrade})
            const updatedReview = await Review.findOne({_id: reviewId})
            return res.json({message: 'Review updated successfully ', review: updatedReview})


        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Update review error"})
        }
    }
    async deleteReview (req, res) {
        try {
            const _id = req.user._id
            // console.log('id:', _id)

            const user = await User.findOne({_id})
            // console.log('user:', user)
            if (!user) {
                return res.status(400).json({message: 'User not found'})
            }
            const {reviewId} = req.body
            const review = await Review.findOne({_id: reviewId})
            if (!review) {
                return res.status(400).json({message: 'Review not found'})
            }
            await Review.findOneAndDelete({_id: reviewId})
            return res.json({message: 'Review deleted successfully ', review})
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Delete review error"})
        }
    }


}

export default new reviewsController