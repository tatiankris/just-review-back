import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

const secret = process.env.SECRET_KEY || 'Y291cnNl'

export const roleMiddleware = (roles) => {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            return next()
        }

        try {
            const token = req.headers.authorization.split(' ')[1]
            console.log('token', token)
            if (!token) {
                return res.status(401).json({message: 'No token'})
            }
            const decoded = jwt.verify(token, secret)
            console.log('decoded', decoded)

            let hasRole = false
            decoded.roles.forEach(r => {
                if (roles.includes(r)) {
                    hasRole = true
                }
                console.log('role', r)
            })


            if (!hasRole) {
                return res.status(401).json({message: 'Limited access!'})
            }
            next()

        } catch (e) {
            return res.status(401).json({message: 'Access error'})
        }
    }


}