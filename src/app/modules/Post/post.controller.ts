import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PostServices } from "./post.service";
import { isMemoryStorage } from "../../utils/multer";
import { uploadToCloudinary, isCloudinaryConfigured } from "../../utils/cloudinary";
import { uploadToDoSpaces, isDoSpacesConfigured } from "../../utils/doSpaces";


// Helper function to upload image to Digital Ocean Spaces or fallback
const uploadImageToStorage = async (file: Express.Multer.File, folder: string): Promise<string> => {
    let buffer: Buffer;
    
    // Get buffer from file - either from memory or read from disk
    if (isMemoryStorage) {
        // File is already in memory
        if (!file.buffer) {
            throw new Error('File buffer is missing');
        }
        buffer = file.buffer;
    } else {
        // File is on disk, read it into buffer
        const fs = require('fs');
        const path = require('path');
        // Multer stores files in 'src/app/uploads' directory
        const filePath = path.join(process.cwd(), 'src', 'app', 'uploads', file.filename);
        buffer = fs.readFileSync(filePath);
        // Delete the local file after reading to save disk space
        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            console.warn('Failed to delete local file:', err);
        }
    }

    // Try Digital Ocean Spaces first
    if (isDoSpacesConfigured()) {
        try {
            return await uploadToDoSpaces(buffer, folder, file.originalname);
        } catch (error) {
            console.error('Digital Ocean Spaces upload failed:', error);
            // Continue to fallback options
        }
    }
    
    // Fallback to Cloudinary if configured
    if (isCloudinaryConfigured()) {
        try {
            return await uploadToCloudinary(buffer, folder);
        } catch (error) {
            console.error('Cloudinary upload failed:', error);
            // Continue to fallback options
        }
    }
    
    // Final fallback: base64 for memory storage, or error if DO Spaces not configured
    if (isMemoryStorage) {
        const base64 = buffer.toString('base64');
        const mimeType = file.mimetype || 'image/jpeg';
        return `data:${mimeType};base64,${base64}`;
    } else {
        // If we're using disk storage and DO Spaces is not configured, throw error
        throw new Error('Digital Ocean Spaces must be configured for image uploads. Please set DO_SPACES environment variables.');
    }
};

const createPost = catchAsync(async (req, res) => {
    const body = req.body;
    let featuredImage: string | undefined = undefined;

    if (req.file) {
        featuredImage = await uploadImageToStorage(req.file, 'blog-featured');
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

    const imageUrl = await uploadImageToStorage(req.file, 'blog-content');
    
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
        featuredImage = await uploadImageToStorage(req.file, 'blog-featured');
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