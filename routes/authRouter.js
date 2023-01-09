import Router from 'express'
import controller from '../controllers/authController.js'
import {check} from "express-validator"
import {authMiddleware} from '../middleware/auth.middleware.js'
import {roleMiddleware} from "../middleware/role.middleware.js";
import passport from "passport";
const router = new Router()
const CLIENT_URL = 'https://just-review-front.vercel.app' //'http://localhost:3000'

router.post('/registration',
    [
    check('email', "Email не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 4 и меньше 10 символов").isLength({min:1})
], controller.registration)

router.post('/login', controller.login)

router.get('/me', authMiddleware, controller.authMe)

router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)


router.get('/login/success', controller.googleSuccess);
router.get('/login/failed', (req, res) => {
        res.status(401).json({
            success: false,
            message: "failure",
        });
});
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);
});

router.get('/google', passport.authenticate("google", { scope: ['profile', 'email']}));
router.get('/google/callback', passport.authenticate("google", {
    successRedirect: CLIENT_URL + '/google',
    failureRedirect: "/login/failed"
}));
router.get('/github', passport.authenticate("github", { scope: ['profile', 'email']}));
router.get('/github/callback', passport.authenticate("github", {
    successRedirect: CLIENT_URL + '/google',
    failureRedirect: "/login/failed"
}));


export default router