import mongoose, { Schema, model } from 'mongoose';
import { IPost, IBlogSection } from './post.interface';

const BlogSectionSchema = new Schema<IBlogSection>(
  {
    subsectionTitle: { type: String },
    description: { type: String }, // TipTapEditor HTML content
    images: [{ type: String }], // Array of image URLs
    videos: [{ type: String }], // Array of YouTube iframe URLs
  },
  { _id: false }
);

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String },
    content: { type: String }, // Legacy field, kept for backward compatibility
    sections: [BlogSectionSchema], // New sections-based content

    metaTitle: { type: String },
    metaDescription: { type: String },
    focusKeyword: { type: String },

    categories: [{ type: String }], 
    tags: [{ type: String }],

    featuredImage: { type: String }, 

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Post = model<IPost>("Post", PostSchema);