import {model, Schema} from "mongoose";

const Tag = new Schema({
    title: {
        type: String,
        unique: true,
    }
})

export default model('Tag', Tag)