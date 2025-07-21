import { Router } from 'express';
import { PostRoutes } from '../modules/Post/post.route';
import { UserRoutes } from '../modules/User/user.route';



const router = Router();

const moduleRoutes = [
    {
        path: '/post',
        route: PostRoutes
    },
    {
        path: '/user',
        route: UserRoutes
    },

];


moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;