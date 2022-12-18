import {model, Schema} from "mongoose";
const URL = "https://s.studiobinder.com/wp-content/uploads/2020/10/Best-Guy-Ritchie-Movies-%E2%80%94-His-Entire-Filmography-Ranked-Featured.jpeg"

const Review = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        userName: {
            type: Schema.Types.String,
            ref: 'User',
            required: true
        },
        tags: [
            {type: Object,
            // ref: 'Tag'
        }],
        category: {
            type: Object,
            // ref: 'Category',
            required: true
        },

        likes: {
            type: Number,
            required: true,
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

        authorGrade: {
            type: Number,
            required: true
        },
        overallRating: {
            type: Object,
            default: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
        },
        comments: {
            type: Number,
            required: true,
            default: 0
        },
        imageURL: {
            type: String,
            default: URL
        },
    },
{
    timestamps: true,
})

export default model('Review', Review)