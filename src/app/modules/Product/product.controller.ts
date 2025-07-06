import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./product.service";

const createProduct = catchAsync(async (req, res) => {
    const { barcode } = req.body;

    const result = await ProductServices.createProductIntoDB(barcode);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Product Created Successfully",
        data: result
    });

});


const getAllProducts = catchAsync(async (req, res) => {
    const { category, searchTerm, page = 1, limit = 10, allRecord = false } = req.query;

    const paginationOptions = {
        page: Number(page),
        limit: Number(limit),
        allRecord: Boolean(allRecord)
    };

    const filters = {
        category: category as string | undefined,
        searchTerm: searchTerm as string | undefined,
    };

    const result = await ProductServices.getAllProductFromDB(filters, paginationOptions);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Products Retrieved Successfully',
        data: result.data,
        meta: result.meta,
    });
});



const updateCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { category } = req.body;

    if (!category) {
        sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: 'Category is required',
            data: null,
        });
    }

    const result = await ProductServices.updateCategoryToDB(id, category);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Product Added to Category',
        data: result,
    });
})



export const ProductControllers = {
    createProduct,
    getAllProducts,
    updateCategory,
}