import Router from 'express'
import reviewsOperations from '../controllers/reviewsOperationsController.js'
import review from '../controllers/reviewsController.js'
const router = new Router
import {authMiddleware} from "../middleware/auth.middleware.js";
import multer, {memoryStorage} from 'multer';

const storage = memoryStorage()

export const upload = multer({storage})

router.get('/all', review.all)
router.get('/:name', review.author)

router.get('/user/:username', review.user)

router.post('/review', authMiddleware, review.createReview)
router.put('/review/:id', authMiddleware, review.updateReview)
router.delete('/review/:id', authMiddleware, review.deleteReview)

router.post('/like', authMiddleware, reviewsOperations.addLike)
router.delete('/like/:reviewId', authMiddleware, reviewsOperations.deleteLike)

router.put('/rating', authMiddleware, reviewsOperations.rating)

router.get('/comment/:reviewId', authMiddleware, reviewsOperations.getComments)
router.post('/comment/:reviewId', authMiddleware, reviewsOperations.addComment)
router.delete('/comment/:reviewId/:commentId', authMiddleware, reviewsOperations.deleteComment)
router.put('/comment/:reviewId/:commentId', authMiddleware, reviewsOperations.updateComment)

router.post('/images',
    // upload.single('image'),
    authMiddleware, review.imageUpload)

export default router





