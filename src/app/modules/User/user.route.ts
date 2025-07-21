import express from 'express';
import validateRequest from '../../middlewares/validateRequests';
import { UserValidation } from './user.validation';
import { UserControllers } from './user.controller';
import adminAuth from '../../middlewares/adminAuth';



const router = express.Router();

router.post('/register', adminAuth({ is_staff: true, is_superuser: true }),
    validateRequest(UserValidation.userValidationSchema),
    UserControllers.userRegister);

router.get('/get_user', UserControllers.getUserByToken);

router.post('/login',
    validateRequest(UserValidation.loginDataValidationSchema),
    UserControllers.userLogin);


export const UserRoutes = router;