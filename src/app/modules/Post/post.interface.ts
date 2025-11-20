import { Document } from "mongoose";

export interface IBlogSection {
  subsectionTitle?: string;
  description?: string; // TipTapEditor HTML content
  images?: string[]; // Array of image URLs
  videos?: string[]; // Array of YouTube iframe URLs
}

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string; // Legacy field, kept for backward compatibility
  sections?: IBlogSection[]; // New sections-based content
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  categories: string[];
  tags: string[];
  featuredImage?: string;
}
