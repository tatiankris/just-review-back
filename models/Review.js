import {model, Schema} from "mongoose";

export const Comment = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
})



const Review = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        tags: {
            type: [String],
            default: []
        },
        likes: {
            type: Number,
            default: 0
        },
        reviewTitle: {
            type: String,
            required: true
        },
        workTitle: {
            type: String,
            required: true
        },
        reviewText: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        authorGrade: {
            type: Number,
            required: true
        },
        overallRating: {
            type: Object,
            default: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
        },
        comments: {
            type: [Comment],
            default: []
        },
        imageURL: {
            type: String,
            default: undefined
        },
    },
{
    timestamps: true,
})

export default model('Review', Review)