import express from 'express'
import { PostControllers } from './post.controller';
import { upload } from '../../utils/multer';
import adminAuth from '../../middlewares/adminAuth';

const router = express.Router();

router.post('/', adminAuth({ is_staff: true, is_superuser: true }), upload.single('featuredImage'), PostControllers.createPost);
router.get('/', PostControllers.getAllPost);

export const PostRoutes = router;