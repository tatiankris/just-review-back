import Review from "../models/Review.js";
import User from "../models/User.js";
import Tag from "../models/Tag.js";
import Category from "../models/Category.js";
import {CommentModel, LikeModel, RatingModel} from "../models/ReviewFeatures.js";
// import cloudinary from '../utils/cloudinary.js'
import dotenv, {config} from "dotenv";
dotenv.config()
import cloudinary from 'cloudinary'
import bcrypt from "bcryptjs";
import images from '../controllers/imagesController.js'



class reviewsController {
    async all (req, res) {
        try {


            const {search, tags, isMain} = req.query

            console.log('isMain', isMain)



            console.log('tags', tags)

            if (search && typeof search === 'string') {
                const text = search.toUpperCase()
                console.log(text)
                const reg = new RegExp(text, 'i')

                if (tags) {
                    const reviews = await Review.find({$or: [{reviewTitle: reg}, {workTitle: reg}, {reviewText: reg}, {commentsSearch: reg}], $and: [{tagsSearch: {$all: tags}}]})
                    return res.json({reviews, isMain: false});
                }

                const reviews = await Review.find({$or: [{reviewTitle: reg}, {workTitle: reg}, {reviewText: reg}, {commentsSearch: reg}]})
                return res.json({reviews, isMain: false});
            }

            const tagArr = await Tag.find()

            if (tags) {
                console.log('tags', tags)
                const reviews = await Review.find({tagsSearch: {$all: tags}})
                return res.json({reviews, isMain: false});
            }

            if (isMain) {
                const latest = await Review.find({}).sort({createdAt:-1}).limit(10)
                const highestRating = await Review.find({}).sort({authorGrade: -1}).limit(10)


                return res.json({latest,highestRating, isMain: true});
            }


            ///Посмотреть как получили PACKS неужели запрашиваем всех сразу??
            const reviews = await Review.find({}).sort({createdAt:-1})
            return res.json({reviews, isMain: false});
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Failed to get reviews"})
        }
    }

    async reviewPage (req, res) {
        try {
            const reviewId = req.params.id

            console.log('reviewId', reviewId)
            if (!reviewId) {
                return res.status(400).json({message: "Bad request"})
            }

            const review = await Review.findOne({_id: reviewId})
            console.log('review', review)
            if (!review) {
                return res.status(400).json({message: "Review not found"})
            }

            const userId = review.userId
            const user = await User.findOne({_id: userId})
            if (!user) {
                return res.status(400).json({message: "User not found"})
            }

            const userAvatar = user.avatar

            return res.json({review, userAvatar})
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Login error!"})
        }
    }

    async author (req, res) {
        try {

           const name = req.params.name
            const user = await User.findOne({username: name})
            if (!user) {
                return res.status(400).json({message: "User not found"})
            }

            const {create, grade, rating, category} = req.query

            if (category === 'null') {
                if (grade !== 'null') {
                    console.log('grade', grade)
                    const sort = Number(grade)
                    const reviews = await Review.find({userId: user._id}).sort({authorGrade: sort})
                    return res.json({reviews});
                }

                if (rating !== 'null') {
                    console.log('rating')
                    const sort = Number(rating)
                    const reviews = await Review.find({userId: user._id}).sort({rating: sort})
                    return res.json({reviews});
                }

                if (create !== 'null') {
                    console.log('мЫ попали')
                    const sort = Number(create)
                    const reviews = await Review.find({userId: user._id}).sort({createdAt: sort})
                    return res.json({reviews});
                }
            } else {
                if (grade !== 'null') {
                    console.log('grade', grade)
                    const sort = Number(grade)
                    const reviews = await Review.find({
                        userId: user._id,
                        'category.title': category
                    }).sort({authorGrade: sort})
                    return res.json({reviews});
                }

                if (rating !== 'null') {
                    console.log('rating')
                    const sort = Number(rating)
                    const reviews = await Review.find({
                        userId: user._id,
                        'category.title': category
                    }).sort({rating: sort})
                    return res.json({reviews});
                }

                if (create !== 'null') {
                    console.log('мЫ попали')
                    const sort = Number(create)
                    const reviews = await Review.find({
                        userId: user._id,
                        'category.title': category
                    }).sort({createdAt: sort})
                    return res.json({reviews});
                }
            }

            const reviews = await Review.find({userId: user._id}).sort({createdAt:-1})
            return res.json({reviews});
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Failed to get author's reviews"})
        }
    }

    async user (req, res) {
        try {

            const username = req.params.username
            const user = await User.findOne({username: username})

            if (!user) {
                return res.status(400).json({message: "Und"})
            }

            const likes = await LikeModel.find({userId: user._id})
            const reviews = await Review.find({userId: user._id})
            // const ratings = await RatingModel.find({userId: user._id})

            return res.json({user: {userId: user._id,
                    email: user. email,
                    username: user.username ,
                    avatar: user.avatar,
                    likes: likes,
                    reviews: reviews,
                    roles: user.roles
                }});
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Failed to get author's reviews"})
        }
    }



    async createReview (req, res) {
        try {

            const authUserId = req.user._id
            const authUser = await User.findOne({_id: authUserId})

            const _id = req.params.userId
            console.log('authUser.roles', authUser.roles.includes('ADMIN'))
            console.log('idS', authUserId, _id )

            if (authUserId !== _id && !authUser.roles.includes('ADMIN')) {
                return res.status(400).json({message: "Overview creation is not possible"})
            }

            const user = await User.findOne({_id})

            if (!user) {
                return res.status(400).json({message: 'User not found'})
            }

            const {reviewTitle, workTitle, reviewText, category, tags, authorGrade, file} = req.body

            //tags
            const oldTags = tags.filter(t => typeof t !== 'string')
            const newTags = tags.filter(t => typeof t === 'string').map(t => {return {title: t}})
            let tagsTitles = []

            if (newTags.length) {
            try{
                await Tag.collection.insertMany(newTags)
                tagsTitles = oldTags.concat(newTags).map(t => t.title)
            } catch (err) {
                console.log(err)
                res.status(400).json({message: "Add new review tags  error"})
            }
            }

            if (!newTags.length) {
                tagsTitles = oldTags.map(t => t.title)
            }

            let reviewTags = []
            let query = Tag.find({
                'title': { $in: tagsTitles}
            }, function(err, docs){

                // console.log("docs", docs);
                reviewTags = docs
                if (err) {
                    console.log("error:", err);
                    return res.status(400).json({message: "Create review tags error"})

                }
            });
            await query.clone();
            // console.log('reviewTags', reviewTags)


            //category

            const reviewCategory = await Category.findOne({title: category.title})

            if (!reviewCategory) {
                return res.status(400).json({message: "Create review category error"})
            }

            const review = new Review({userName: user.username, userId: user._id, reviewTitle, workTitle, reviewText, category: reviewCategory, tags: reviewTags, authorGrade,
            tagsSearch: tagsTitles
            })

            await review.save()


            //IMG
            if (file) {

                console.log('file', file)

                const userId = user._id
                const reviewId = review._id
                const image = await images.imageUpload({userId, reviewId, file})

                if (image.warning || image.messageError) {
                    console.log('image.warning', image )
                    return res.json({message: 'Review created successfully ', review, imageMessage: image.warning || image.messageError})
                }

                const uploadImageReview = await Review.findOneAndUpdate({_id: reviewId}, {imageURL: image.url, imageId: image.publicId})

                return res.json({message: 'Review created successfully ', review: uploadImageReview})
            }

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

            const reviewId = req.params.id
            const {reviewTitle, workTitle, reviewText, category, tags, authorGrade, file} = req.body

            ///tags and category
            const oldTags = tags.filter(t => typeof t !== 'string')
            const newTags = tags.filter(t => typeof t === 'string').map(t => {return {title: t}})
            let tagsTitles = []
            // console.log("newTags.length", newTags.length)

            if (newTags.length) {
                try{
                    await Tag.collection.insertMany(newTags)
                    tagsTitles = oldTags.concat(newTags).map(t => t.title)
                } catch (err) {
                    console.log(err)
                    res.status(400).json({message: "Add new review tags  error"})
                }
            }

            if (!newTags.length) {
                tagsTitles = oldTags.map(t => t.title)
            }

            let reviewTags = []
            let query = Tag.find({
                'title': { $in: tagsTitles}
            }, function(err, docs){

                reviewTags = docs
                if (err) {
                    console.log("error:", err);
                    return res.status(400).json({message: "Create review tags error"})

                }
            });
            await query.clone();

            const reviewCategory = await Category.findOne({title: category.title})

            if (!reviewCategory) {
                return res.status(400).json({message: "Create review category error"})
            }

            const review = await Review.findOne({_id: reviewId})
            if (!review) {
                return res.status(400).json({message: 'Review not found'})
            }

            ///IMG
            //если не изменилась картинка
            if (file && review.imageURL.length && file === review.imageURL) {

                await Review.findOneAndUpdate({_id: reviewId}, {reviewTitle, workTitle, reviewText, category: reviewCategory, tags: reviewTags, authorGrade, tagsSearch: tagsTitles})
                const updatedReview = await Review.findOne({_id: reviewId})
                return res.json({message: 'Review updated successfully ', review: updatedReview})

            }

            const userId = user._id
           //Если картинка уже есть в облаке, но хотят изменить на новую

            if (file && review.imageURL.length && file !== review.imageURL) {
                const image = await images.imageReload({reviewId, userId, file, publicId: review.imageId})

                if (image.warning || image.messageError) {
                    console.log('image.warning', image )
                    return res.json({message: 'Review created successfully ', review, imageMessage: image.warning || image.messageError})
                }
                await Review.findOneAndUpdate({_id: reviewId}, {reviewTitle, workTitle, reviewText, category: reviewCategory,
                    tags: reviewTags, authorGrade, tagsSearch: tagsTitles, imageURL: image.url, imageId: image.publicId })
                const updatedReview = await Review.findOne({_id: reviewId})

                return res.json({message: 'Review updated successfully ', review: updatedReview})
            }

            //Если картинки в облаке еще нет, и решили все же загрузить (в первый раз)
            if (file && !review.imageURL.length) {
                 const image = await images.imageUpload({reviewId, userId, file})

                if (image.warning || image.messageError) {
                    console.log('image.warning', image )
                    return res.json({message: 'Review created successfully ', review, imageMessage: image.warning || image.messageError})
                }

                await Review.findOneAndUpdate({_id: reviewId}, {reviewTitle, workTitle, reviewText, category: reviewCategory,
                    tags: reviewTags, authorGrade, tagsSearch: tagsTitles, imageURL: image.url, imageId: image.publicId })
                const updatedReview = await Review.findOne({_id: reviewId})

                return res.json({message: 'Review updated successfully ', review: updatedReview})
            }
            //Если картинка есть в облаке, но хотят удалить
            if (!file && review.imageURL.length) {
                const deleteRes = await images.imageDelete({publicId: review.imageId})

                await Review.findOneAndUpdate({_id: reviewId}, {reviewTitle, workTitle, reviewText, category: reviewCategory,
                    tags: reviewTags, authorGrade, tagsSearch: tagsTitles, imageURL: '', imageId: '' })
                const updatedReview = await Review.findOne({_id: reviewId})
                return res.json({message: 'Review updated successfully ', review: updatedReview})
            }

            await Review.findOneAndUpdate({_id: reviewId}, {reviewTitle, workTitle, reviewText, category: reviewCategory, tags: reviewTags, authorGrade, tagsSearch: tagsTitles})
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
            const reviewId = req.params.id
            const review = await Review.findOne({_id: reviewId})
            if (!review) {
                return res.status(400).json({message: 'Review not found'})
            }

            if (review.imageId) {
                const response = await images.imageDelete({userId: _id, reviewId})
            }

            await Review.findOneAndDelete({_id: reviewId})
            await RatingModel.deleteMany({reviewId})
            await LikeModel.deleteMany({reviewId})
            await CommentModel.deleteMany({reviewId})
            return  res.json({message: 'Review deleted successfully ', review})
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Delete review error"})
        }
    }
}

export default new reviewsController