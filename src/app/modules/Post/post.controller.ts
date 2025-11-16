import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PostServices } from "./post.service";
import { isMemoryStorage } from "../../utils/multer";
import { uploadToCloudinary, isCloudinaryConfigured } from "../../utils/cloudinary";


const createPost = catchAsync(async (req, res) => {
    const body = req.body;
    let featuredImage: string | undefined = undefined;

    if (req.file) {
        if (isMemoryStorage) {
            // In serverless, upload to Cloudinary if configured, otherwise use base64
            if (isCloudinaryConfigured()) {
                try {
                    featuredImage = await uploadToCloudinary(req.file.buffer, 'blog-featured');
                } catch (error) {
                    console.error('Cloudinary upload failed:', error);
                    // Fallback to base64 if Cloudinary fails
                    const base64 = req.file.buffer.toString('base64');
                    const mimeType = req.file.mimetype;
                    featuredImage = `data:${mimeType};base64,${base64}`;
                }
            } else {
                // Fallback to base64 if Cloudinary not configured
                const base64 = req.file.buffer.toString('base64');
                const mimeType = req.file.mimetype;
                featuredImage = `data:${mimeType};base64,${base64}`;
            }
        } else {
            // In local/dev, use filename
            featuredImage = req.file.filename;
        }
    }

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

    let imageUrl: string;
    
    if (isMemoryStorage) {
        // In serverless, upload to Cloudinary if configured
        if (isCloudinaryConfigured()) {
            try {
                imageUrl = await uploadToCloudinary(req.file.buffer, 'blog-content');
            } catch (error) {
                console.error('Cloudinary upload failed:', error);
                // Fallback to base64 if Cloudinary fails
                const base64 = req.file.buffer.toString('base64');
                const mimeType = req.file.mimetype;
                imageUrl = `data:${mimeType};base64,${base64}`;
            }
        } else {
            // Fallback to base64 if Cloudinary not configured
            const base64 = req.file.buffer.toString('base64');
            const mimeType = req.file.mimetype;
            imageUrl = `data:${mimeType};base64,${base64}`;
        }
    } else {
        // In local/dev, use file path
        imageUrl = `/uploads/${req.file.filename}`;
    }
    
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
    let featuredImage: string | undefined = undefined;

    if (req.file) {
        if (isMemoryStorage) {
            // In serverless, upload to Cloudinary if configured
            if (isCloudinaryConfigured()) {
                try {
                    featuredImage = await uploadToCloudinary(req.file.buffer, 'blog-featured');
                } catch (error) {
                    console.error('Cloudinary upload failed:', error);
                    // Fallback to base64 if Cloudinary fails
                    const base64 = req.file.buffer.toString('base64');
                    const mimeType = req.file.mimetype;
                    featuredImage = `data:${mimeType};base64,${base64}`;
                }
            } else {
                // Fallback to base64 if Cloudinary not configured
                const base64 = req.file.buffer.toString('base64');
                const mimeType = req.file.mimetype;
                featuredImage = `data:${mimeType};base64,${base64}`;
            }
        } else {
            // In local/dev, use filename
            featuredImage = req.file.filename;
        }
    }

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