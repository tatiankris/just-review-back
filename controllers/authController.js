import User from '../models/User.js'
import Role from "../models/Role.js";
import {validationResult} from "express-validator";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import images from "./imagesController.js";
dotenv.config()
const AVATAR = 'data:image/png;base64,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'

const generateAccessToken = (_id, roles) => {
    const payload = {
        _id, roles
    }
    return jwt.sign( payload, process.env.SECRET_KEY, {expiresIn: "24h"} )
}

class authController {

    async registration (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Registration error"})
            }

            const {username, email, password} = req.body
            const candidate1 = await User.findOne({username})
            const candidate2 = await User.findOne({email})
            if (candidate1 || candidate2) {
                return res.status(400).json({message: 'User with same username or email already exist'})
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({value: 'USER'})
            const user = new User({username, email, password: hashPassword, roles: [userRole.value]})
            await user.save()

            const userId = user._id
            const file = AVATAR
            const avatar = await images.avatarUpload({userId, file})

            const userWithAva = await User.findOneAndUpdate({_id: userId}, {avatar: avatar})
            return res.json({message: 'User registered successfully ', userWithAva})
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Registration error!"})
        }
    }

    async login (req, res) {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if (!user) {
                return res.status(400).json({message: `User ${email} not found`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Invalid password`})
            }
            const token = generateAccessToken(user._id, user.roles)

            return res.json({token, user})
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Login error!"})
        }
    }
    async authMe (req, res) {
        try {
            console.log('req.user', req.user)
            const user = await User.findOne({_id: req.user._id})
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token, user})
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Authorization error!"})
        }
    }

    async getUsers (req, res) {
        try {
            const users = await User.find()

            return res.json({users})
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Get users error!"})
        }
    }
    async googleSuccess (req, res) {
        try {

            console.log('REQQQQQQISS', req.user)
            if (req.user) {
                const email = req.user.email


                const userRole = await Role.findOne({value: 'USER'})

                if(email.provider && email.provider === 'github') {
                    const passwordHash = bcrypt.hashSync(email.username, 7)

                    console.log("password Hashed", passwordHash)
                    const user = await User.findOrCreate({
                        email: email.profileUrl
                    }, {
                        email: email.profileUrl,
                        password: passwordHash,
                        username: email.username,
                        avatar: email.photos[0].value,
                        roles: [userRole.value]
                    })

                    const getUser = await User.findOne({email: email.profileUrl})
                    const token = generateAccessToken(getUser._id, getUser.roles)

                    return res.status(200).json({
                        success: true,
                        message: "successfull",
                        user: getUser,
                        token: token
                        //cookies: req.cookies
                    });

                } else {

                    console.log("email.id", email.emails[0].value)
                    const passwordHash = bcrypt.hashSync(email.emails[0].value.slice(0, 6), 7)

                    console.log("password Hashed", passwordHash)
                    const user = await User.findOrCreate({
                        email: email.emails[0].value
                    }, {
                        email: email.emails[0].value,
                        password: passwordHash,
                        username: email.emails[0].value.slice(0, -10),
                        avatar: email.photos[0].value,
                        roles: [userRole.value]
                    })

                    const getUser = await User.findOne({email: email.emails[0].value})
                    const token = generateAccessToken(getUser._id, getUser.roles)

                    return res.status(200).json({
                        success: true,
                        message: "successfull",
                        user: getUser,
                        token: token
                        //cookies: req.cookies
                    });
                }
            } else {
                return res.status(403).json({error: true, message: 'Not authorized'})
            }
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({message: "Get users error!"})
        }
    }

}

export default new authController()
