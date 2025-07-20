import mongoose, { Schema, model } from 'mongoose';
import { IPost } from './post.interface';

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String },
    content: { type: String },

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