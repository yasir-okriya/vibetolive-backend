import mongoose, { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';


const productSchema = new Schema<IProduct>(
    {
        material: {
            type: Number,
            required: true
        },
        barcode: { 
            type: String, 
            required: true, 
            unique: true 
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            default: 'Uncategorized'
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);


export const Product = model<IProduct>("Product", productSchema);