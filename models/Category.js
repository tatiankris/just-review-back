import {model, Schema} from "mongoose";

const Category = new Schema({
    title: {
        type: String,
        unique: true,
    }
})

export default model('Category', Category)