import {model, Schema} from "mongoose";
import findOrCreate from 'mongoose-findorcreate'

const User = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        // required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://images.pexels.com/photos/20787/pexels-photo.jpg?cs=srgb&dl=pexels-krysten-merriman-20787.jpg&fm=jpg'
    },
    likes: [{
        type: Object,
    }],
    ratings: [{
        type: Object,
    }],
    roles: [{type: String, ref: 'Role'}]
})

User.plugin(findOrCreate);

export default model('User', User)