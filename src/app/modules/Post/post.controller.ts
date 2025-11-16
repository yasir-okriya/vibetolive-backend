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

const getPaginatedPosts = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await PostServices.getPaginatedPostsFromDB(page, limit);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Posts retrieved successfully",
        data: result,
    });
});

const uploadImage = catchAsync(async (req, res) => {
    if (!req.file) {
        sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "No image file provided",
            data: null,
        });
        return;
    }

    // Return the image URL
    const imageUrl = `/uploads/${req.file.filename}`;
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Image uploaded successfully",
        data: { url: imageUrl },
    });
});

const updatePost = catchAsync(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const featuredImage = req.file?.filename || undefined;

    const result = await PostServices.updatePostInDB(id, body, featuredImage);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Post Updated Successfully",
        data: result
    });
});

const deletePost = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await PostServices.deletePostFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Post Deleted Successfully",
        data: result
    });
});







export const PostControllers = {
    createPost,
    getAllPost,
    getPaginatedPosts,
    uploadImage,
    updatePost,
    deletePost
}