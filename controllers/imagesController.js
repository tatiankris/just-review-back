import dotenv, {config} from "dotenv";
dotenv.config()
import cloudinary from 'cloudinary'
import User from "../models/User.js";
import user from "../models/User.js";

class imagesController {

    async imageUpload (data) {
        try {

            const {userId, reviewId, file} = data

            if (!userId || !reviewId) {
                return {messageError: "Data to upload image not found!"}
            }

            if (!file) {
                return {warning: "Image was not loaded!"}
            }

            cloudinary.v2.config({
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.CLOUD_KEY,
                api_secret: process.env.CLOUD_KEY_SECRET,
            })

            const result = await cloudinary.v2.uploader.upload(file, {
                folder: `users/${userId}/reviews/${reviewId}`,
                // width: 300,
                // height: 140
                // crop: 'scale'
            })

            console.log(file)
            console.log(userId)

            const image = {
                public_id: result.public_id,
                url: result.secure_url
            }

            console.log('image', image)

            return {url: image.url, publicId: image.public_id, messageSuccess: 'Image upload successfully'}
        } catch (err) {
            console.log(err)
            return {messageError: "Upload image error"}
        }
    }
    async imageReload (data) {
        try {

            const {userId, reviewId, file, publicId} = data

            if (!userId || !reviewId || !publicId) {
                return {messageError: "Data to reload image not found!"}
            }

            if (!file) {
                return {warning: "Image was not loaded!"}
            }

            cloudinary.v2.config({
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.CLOUD_KEY,
                api_secret: process.env.CLOUD_KEY_SECRET,
            })


            const deleteRes = await cloudinary.v2.uploader.destroy(`${publicId}`)

            if (deleteRes.result !== 'ok') {
                return {warning: "Failed to delete image!"}
            }

            const result = await cloudinary.v2.uploader.upload(file, {
                folder: `users/${userId}/reviews/${reviewId}`,
                // width: 300,
                // height: 140
                // crop: 'scale'
            })

            console.log(file)
            console.log(userId)

            const image = {
                public_id: result.public_id,
                url: result.secure_url
            }

            console.log('image', image)

            return {url: image.url, publicId: image.public_id, messageSuccess: 'Image upload successfully'}
        } catch (err) {
            console.log(err)
            return {messageError: "Upload image error"}
        }
    }

    async imageDelete (data) {
        try {
            cloudinary.v2.config({
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.CLOUD_KEY,
                api_secret: process.env.CLOUD_KEY_SECRET,
            })

            const {userId, reviewId, publicId} = data

            if (!publicId) {
                return {messageError: "Data for delete image not found!"}
            }

            if (publicId) {
                const deleteRes = await cloudinary.v2.uploader.destroy(`${publicId}`)

                if (deleteRes.result !== 'ok') {
                    return {warning: "Failed to delete image!"}
                }
            }

            if (!reviewId && !userId) {
                return {messageError: "Data for delete folder not found!"}
            }
            if (reviewId && userId) {
                await cloudinary.v2.api.delete_folder(`users/${userId}/reviews/${reviewId}`)
            }

            return {message: 'Image delete successfully'}

        } catch (err) {
            console.log(err)
            return {messageError: "Upload image error"}
        }
    }

}

export default new imagesController