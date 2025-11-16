import express from 'express'
import { PostControllers } from './post.controller';
import { upload } from '../../utils/multer';
import adminAuth from '../../middlewares/adminAuth';

const router = express.Router();

router.post('/', adminAuth({ is_staff: true, is_superuser: true }), upload.single('featuredImage'), PostControllers.createPost);
router.post('/upload-image', adminAuth({ is_staff: true, is_superuser: true }), upload.single('image'), PostControllers.uploadImage);
router.get('/', PostControllers.getAllPost);
router.get('/paginated', PostControllers.getPaginatedPosts);
router.put('/:id', adminAuth({ is_staff: true, is_superuser: true }), upload.single('featuredImage'), PostControllers.updatePost);
router.delete('/:id', adminAuth({ is_staff: true, is_superuser: true }), PostControllers.deletePost);

export const PostRoutes = router;
