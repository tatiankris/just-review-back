import User from '../models/User.js'
import Role from "../models/Role.js";
import {validationResult} from "express-validator";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

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
            return res.json({message: 'User registered successfully ', user})
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
            return res.json(users)
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
