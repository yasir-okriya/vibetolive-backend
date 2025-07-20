import express from 'express'
import { PostControllers } from './post.controller';
import { upload } from '../../utils/multer';

const router = express.Router();

router.post('/', upload.single('featuredImage'), PostControllers.createPost);
router.get('/', PostControllers.getAllPost);

export const PostRoutes = router