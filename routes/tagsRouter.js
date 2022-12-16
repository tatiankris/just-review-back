import Router from 'express'
import tags from "../controllers/tagsController.js";
const router = new Router
import {authMiddleware} from "../middleware/auth.middleware.js";

router.get('/tags', tags.getTags)
router.get('/categories', tags.getCategories)

router.post('/tags', tags.createTag)
router.delete('/tags/:id', tags.deleteTag)

router.post('/categories', tags.createCategory)
router.delete('/categories/:id', tags.deleteCategory)

export default router
