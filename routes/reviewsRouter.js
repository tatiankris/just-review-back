import Router from 'express'
import reviewsOperations from '../controllers/reviewsOperationsController.js'
import review from '../controllers/reviewsController.js'
const router = new Router
import {authMiddleware} from "../middleware/auth.middleware.js";

router.get('/all', review.all)
router.get('/author',authMiddleware, review.author)

router.post('/review', authMiddleware, review.createReview)
router.put('/review', authMiddleware, review.updateReview)
router.patch('/review', authMiddleware, review.deleteReview)

router.put('/like', authMiddleware, reviewsOperations.like)
router.put('/rating', authMiddleware, reviewsOperations.rating)

router.post('/comment', authMiddleware, reviewsOperations.addComment)
router.delete('/comment', authMiddleware, reviewsOperations.deleteComment)
router.put('/comment', authMiddleware, reviewsOperations.updateComment)

export default router





