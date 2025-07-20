import { Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  categories: string[];
  tags: string[];
  featuredImage?: string;
}
