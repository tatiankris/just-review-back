import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const secret = process.env.SECRET_KEY || 'Y291cnNl'

export const authMiddleware = (req, res, next) => {

    if(req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({message: 'No token'})
        }
        const decoded = jwt.verify(token, secret)
        req.user = decoded
        next()
    } catch (e) {
        return res.status(401).json({message: 'Auth token error'})
    }
}