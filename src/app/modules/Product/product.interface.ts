import { Document } from "mongoose";

export interface IProduct extends Document {
    material: number;
    barcode: string;
    description: string;
    category: string;
}