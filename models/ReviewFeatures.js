import {model, Schema} from "mongoose";
const URL = "https://s.studiobinder.com/wp-content/uploads/2020/10/Best-Guy-Ritchie-Movies-%E2%80%94-His-Entire-Filmography-Ranked-Featured.jpeg"

const Comment = new Schema({
    review: {
        type: Schema.Types.ObjectId,
        ref: 'Review',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        require: true
    },
    avatar: {
        type: String,
    },
    username: {
        type: Schema.Types.String,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true,
})

export const CommentModel = model('Comment', Comment)

const Like = new Schema({
    reviewId: {
        type: Schema.Types.ObjectId,
        ref: 'Review',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export const LikeModel = model('Like', Like)

const Rating = new Schema({
    reviewId: {
        type: Schema.Types.ObjectId,
        ref: 'Review',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
})

export const RatingModel = model('Rating', Rating)