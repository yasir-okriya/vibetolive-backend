import { IPost } from "./post.interface";
import { Post } from "./post.model";

const createPostIntoDB = async (body: any, featuredImage: any) => {


    const { title, slug, excerpt, content, metaTitle, metaDescription, focusKeyword, categories, tags } = body;

    const newPost: Partial<IPost> = {
        title,
        slug,
        excerpt,
        content,
        metaTitle,
        metaDescription,
        focusKeyword,
        categories: categories?.split(',').map((c: string) => c.trim()),
        tags: tags?.split(',').map((t: string) => t.trim()),
        featuredImage,
    };

    const result = await Post.create(newPost);
    return result;

};



const getPostsFromDB = async (id?: string) => {
    if (id) {
        const post = await Post.findById(id);
        if (!post) throw new Error("Post not found");
        return post;
    }

    return await Post.find({}).sort({ createdAt: -1 });
};



export const PostServices = {
    createPostIntoDB,
    getPostsFromDB,
}