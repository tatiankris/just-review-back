import Router from 'express'
import controller from '../controllers/authController.js'
import {check} from "express-validator"
import {authMiddleware} from '../middleware/auth.middleware.js'
import {roleMiddleware} from "../middleware/role.middleware.js";

const router = new Router()

router.post('/registration',
    [
    check('email', "Email не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 4 и меньше 10 символов").isLength({min:1})
], controller.registration)

router.post('/login', controller.login)

router.get('/me', authMiddleware, controller.authMe)

router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)

export default router