import { IPost } from "./post.interface";
import { Post } from "./post.model";

const createPostIntoDB = async (body: any, featuredImage: any) => {
    const { title, slug, excerpt, content, sections, metaTitle, metaDescription, focusKeyword, categories, tags } = body;

    // Parse sections if provided as JSON string
    let parsedSections = sections;
    if (typeof sections === 'string') {
        try {
            parsedSections = JSON.parse(sections);
        } catch (e) {
            console.error('Failed to parse sections:', e);
            parsedSections = [];
        }
    }

    const newPost: Partial<IPost> = {
        title,
        slug,
        excerpt,
        content, // Keep for backward compatibility
        sections: parsedSections || [], // New sections-based content
        metaTitle,
        metaDescription,
        focusKeyword,
        categories: categories?.split(',').map((c: string) => c.trim()).filter((c: string) => c),
        tags: tags?.split(',').map((t: string) => t.trim()).filter((t: string) => t),
        featuredImage,
    };

    const result = await Post.create(newPost);
    return result;
};



const getPostsFromDB = async (id?: string | null) => {
    console.log(id)
    if (id !== null && id !== '') {
        // Try to find by slug first (more common), then by ID
        let post = await Post.findOne({ slug: id });
        if (!post) {
            // If not found by slug, try MongoDB ObjectId
            post = await Post.findById(id);
        }
        if (!post) throw new Error("Post not found");
        return post;
    }

    return await Post.find({}).sort({ createdAt: -1 });
};

const getPaginatedPostsFromDB = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
        Post.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Post.countDocuments({})
    ]);

    return {
        posts,
        total,
        page,
        pages: Math.ceil(total / limit)
    };
};

const updatePostInDB = async (id: string, body: any, featuredImage?: string) => {
    const { title, slug, excerpt, content, sections, metaTitle, metaDescription, focusKeyword, categories, tags } = body;

    // Try to find by slug first, then by ID
    let post = await Post.findOne({ slug: id });
    if (!post) {
        post = await Post.findById(id);
    }
    if (!post) throw new Error("Post not found");

    // Parse sections if provided as JSON string
    let parsedSections = sections;
    if (typeof sections === 'string') {
        try {
            parsedSections = JSON.parse(sections);
        } catch (e) {
            console.error('Failed to parse sections:', e);
            parsedSections = undefined; // Don't update if parsing fails
        }
    }

    // Prepare update data
    const updateData: any = {
        title,
        slug,
        excerpt,
        content, // Keep for backward compatibility
        metaTitle,
        metaDescription,
        focusKeyword,
        categories: categories?.split(',').map((c: string) => c.trim()).filter((c: string) => c),
        tags: tags?.split(',').map((t: string) => t.trim()).filter((t: string) => t),
    };

    // Update sections if provided
    if (parsedSections !== undefined) {
        updateData.sections = parsedSections;
    }

    // Only update featuredImage if a new one was uploaded
    if (featuredImage) {
        updateData.featuredImage = featuredImage;
    }

    const result = await Post.findByIdAndUpdate(post._id, updateData, { new: true, runValidators: true });
    return result;
};

const deletePostFromDB = async (id: string) => {
    // Try to find by slug first, then by ID
    let post = await Post.findOne({ slug: id });
    if (!post) {
        post = await Post.findById(id);
    }
    if (!post) throw new Error("Post not found");

    const result = await Post.findByIdAndDelete(post._id);
    return result;
};

export const PostServices = {
    createPostIntoDB,
    getPostsFromDB,
    getPaginatedPostsFromDB,
    updatePostInDB,
    deletePostFromDB,
}