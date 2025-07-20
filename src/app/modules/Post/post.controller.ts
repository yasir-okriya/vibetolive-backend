import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PostServices } from "./post.service";


const createPost = catchAsync(async (req, res) => {
    const body = req.body;
    const featuredImage = req.file?.filename || undefined;

    const result = await PostServices.createPostIntoDB(body, featuredImage);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Post Created Successfully",
        data: result
    });

});


const getAllPost = catchAsync(async (req, res) => {
    const postId = req.query.id as string | undefined;

    const result = await PostServices.getPostsFromDB(postId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: postId ? "Post retrieved successfully" : "Posts retrieved successfully",
        data: result,
    });
});







export const PostControllers = {
    createPost,
    getAllPost
}