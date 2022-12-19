import Review from "../models/Review.js";
import User from "../models/User.js";
import {CommentModel, LikeModel} from "../models/ReviewFeatures.js";
import review from "../models/Review.js";

class reviewsOperationsController {
    async addLike (req, res) {
        try {
            const {reviewId} = req.body
            if (!reviewId) {
                return res.status(400).json({message: "Review id no found"})
            }

            const userId = req.user._id
            if (!userId) {
                return res.status(400).json({message: "No authorize"})
            }
            const likeCheck = await LikeModel.findOne({userId, reviewId})
            if (likeCheck) {
                return res.status(400).json({message: "User can add only one like"})
            }

            const like = new LikeModel({userId, reviewId})
            await like.save()

            const likes = await LikeModel.find({reviewId})

            await Review.findOneAndUpdate({_id: reviewId}, {likes: likes})
            const review = await Review.findOne({_id: reviewId})

            // const authUserLikes = await LikeModel.find({reviewId, userId})

            return res.json({message: 'Liked successfully ', likes: review.likes})

        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Like error"})
        }
    }
    async deleteLike (req, res) {
        try {
            const {reviewId} = req.params
            if (!reviewId) {
                return res.status(400).json({message: "Review id no found"})
            }
            const userId = req.user._id
            if (!userId) {
                return res.status(400).json({message: "No authorize"})
            }

            const like = await LikeModel.findOne({userId, reviewId})
            if (!like) {
                return res.status(400).json({message: "Like not found"})
            }

            await LikeModel.findOneAndDelete({_id: like._id})

            const likes = await LikeModel.find({reviewId})
            await Review.findOneAndUpdate({_id: reviewId}, {likes: likes})
            const review = await Review.findOne({_id: reviewId})
            return res.json({message: 'Disliked successfully ', likes: review.likes})
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Dislike error"})
        }
    }

    async rating (req, res) {
        try {

        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Rating error"})
        }
    }
    async getComments (req, res) {
        try {
            const reviewId = req.params.reviewId

            if(!reviewId) {
                return res.status(400).json({message: "Review id no found"})

            }

            const comments = await CommentModel.find({review: reviewId})
            if(!comments) {
                return res.json({message: 'Comments not found, status: 200'})
            }

            return res.json({message: 'Comments was found', comments})


        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Rating error"})
        }
    }
    async addComment (req, res) {
        try {

            const {reviewId} = req.params
            if (!reviewId) {
                return res.status(400).json({message: "Review id not found"})
            }
            const review = await Review.findOne({_id: reviewId})
            if (!review) {
                return res.status(400).json({message: "Review not found"})
            }

            const userId = req.user._id
            if (!userId) {
                return res.status(400).json({message: "No autorize"})
            }
            const user = await User.findOne({_id: userId})
            if (!user) {
                return res.status(400).json({message: "User not found"})
            }

            const {text} = req.body
            if (!text) {
                return res.status(400).json({message: "No text"})
            }

            const comment = new CommentModel({review, user, text})
            await comment.save()


            await Review.findOneAndUpdate({_id: reviewId}, {comments: ++review.comments})
            const comments = await CommentModel.find({review: reviewId})

            return res.json({message: 'Comment added successfully ', comments})
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Add comment error"})
        }
    }
    async updateComment (req, res) {
        try {
            const {reviewId, commentId} = req.params

            if (!reviewId) {
                return res.status(400).json({message: "Review id not found"})
            }
            if (!commentId) {
                return res.status(400).json({message: "Comment id not found"})
            }
            const review = await Review.findOne({_id: reviewId})
            if (!review) {
                return res.status(400).json({message: "Review not found"})
            }

            const userId = req.user._id
            if (!userId) {
                return res.status(400).json({message: "No autorize"})
            }
            const user = await User.findOne({_id: userId})
            if (!user) {
                return res.status(400).json({message: "User not found"})
            }
            const {text} = req.body
            if (!text) {
                return res.status(400).json({message: "No text"})
            }
            // console.log("text", text)

            const comment = await CommentModel.findOneAndUpdate({_id: commentId}, {text: text})
            if (!comment) {
                return res.status(400).json({message: "Comment not found"})

            }

            const comments = await CommentModel.find({review: reviewId})


            return res.json({message: 'Comment updated successfully ', comments})

        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Update comment error"})
        }
    }
    async deleteComment (req, res) {
        try {
            const {reviewId, commentId} = req.params

            if (!reviewId) {
                return res.status(400).json({message: "Review id not found"})
            }
            if (!commentId) {
                return res.status(400).json({message: "Comment id not found"})
            }
            const review = await Review.findOne({_id: reviewId})
            if (!review) {
                return res.status(400).json({message: "Review not found"})
            }

            const userId = req.user._id
            if (!userId) {
                return res.status(400).json({message: "No autorize"})
            }
            const user = await User.findOne({_id: userId})
            if (!user) {
                return res.status(400).json({message: "User not found"})
            }

            const comment = await CommentModel.findOneAndDelete({_id: commentId})
            if (!comment) {
                return res.status(400).json({message: "Comment not found"})

            }
            await Review.findOneAndUpdate({_id: reviewId}, {comments: --review.comments})

            const comments = await CommentModel.find({review: reviewId})


            return res.json({message: 'Comment deleted successfully ', comments})


        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Delete comment error"})
        }
    }
}

export default new reviewsOperationsController