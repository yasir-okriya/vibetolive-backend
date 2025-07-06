import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Product } from "./product.model"
import axios from "axios";

const createProductIntoDB = async (barcode: string) => {

    const existedProduct = await Product.findOne({ barcode });

    if (existedProduct) {
        throw new AppError(httpStatus.FOUND, "Product Found With Similar Barcode");
    }

    const productInfo = await axios.get(`https://products-test-aci.onrender.com/product/${barcode}`);

    if (productInfo.status !== 200) {
        throw new AppError(httpStatus.NOT_FOUND, "Product Not Found From Test API");
    }

    const { material, barcode: product_barcode, description } = productInfo.data.product;

    const newProduct = new Product({
        material,
        description,
        barcode: product_barcode
    });

    const result = await newProduct.save();

    return result;

};



const getAllProductFromDB = async (
    filters: { category?: string; searchTerm?: string },
    paginationOptions: { page: number; limit: number, allRecord: boolean }
) => {
    const { category, searchTerm } = filters;
    const { page, limit, allRecord } = paginationOptions;

    const andConditions: any[] = [];

    if (category) {
        andConditions.push({ category });
    }

    if (searchTerm) {
        andConditions.push({
            description: { $regex: searchTerm, $options: 'i' },
        });
    }

    const finalFilter = andConditions.length > 0 ? { $and: andConditions } : {};

    const skip = (page - 1) * limit;

    let result = []

    let total = 0

    if (allRecord === true) {
        result = await Product.find();

        total = await Product.countDocuments();
        limit
    }
    else {
        result = await Product.find(finalFilter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        total = await Product.countDocuments(finalFilter);
    }

    return {
        data: result,
        meta: {
            page,
            limit: allRecord === true ? total : limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};



const updateCategoryToDB = async (id: string, category: string) => {
    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { category },
        { new: true }
    );

    if (!updatedProduct) {
        throw new AppError(httpStatus.NOT_FOUND, "Product Not Found");
    }

    return updatedProduct;
}




export const ProductServices = {
    createProductIntoDB,
    getAllProductFromDB,
    updateCategoryToDB,

}