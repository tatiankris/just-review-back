import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import passport from "passport";
import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import Role from "../models/Role.js";
import findOrCreate from 'mongoose-findorcreate'


const generateAccessToken = (_id, roles) => {
    const payload = {
        _id, roles
    }
    return jwt.sign( payload, process.env.SECRET_KEY, {expiresIn: "24h"} )
}

const GOOGLE_CLIENT_ID = '301022637814-i3noevnhjjh0rn88avi7p3d0q5m6hucj.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

const GITHUB_CLIENT_ID = '51eed0be7af19f448be0'
const GITHUB_CLIENT_SECRET = '6e6b1836187f647d37de9c89bd8d12df33c14150'
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
    },
    function (accessToken, refreshToken, profile, email, done) {

        // console.log('email',  email)
        // console.log('profile',  profile)

        const user = {
            email: email
        }
        done(null, user)
        // done(null,email, profile)

        // const user = {
        //     username: profile.displayName,
        //     avatar: profile.photos[0]
        // }
        // user.save()

    }));

passport.use(new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: '/auth/github/callback'
    },
    function (accessToken, refreshToken, profile, email, done) {

        console.log('emailGH',  email)
        // console.log('profile',  profile)

        const user = {
            email: email
        }
        done(null, user)
        // done(null,email, profile)

        // const user = {
        //     username: profile.displayName,
        //     avatar: profile.photos[0]
        // }
        // user.save()

    }));

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

export * from "module"
