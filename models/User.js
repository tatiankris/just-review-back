import {model, Schema} from "mongoose";

const User = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
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
    roles: [{type: String, ref: 'Role'}]
})

export default model('User', User)