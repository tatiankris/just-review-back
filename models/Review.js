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
        tagsSearch:{
            type: Array,
            default: []
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

        likes:  [{
            type: Object,
        }],
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
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        commentsSearch: {
            type: String,
            default: ''
        },
        comments: {
            type: Number,
            required: true,
            default: 0
        },
        imageURL: {
            type: String,
            default: ''
        },
        imageId: {
            type: String,
        }
    },
{
    timestamps: true,
})
Review.index({"reviewText": "text", "workTitle": "text", "reviewTitle": "text"},
    // {"weights": { workTitle: 1, reviewTitle: 2, reviewText: 3 }}
)


export default model('Review', Review)