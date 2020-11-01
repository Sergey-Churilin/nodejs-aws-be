'use strict';
import { productsList } from '../localDb/productsList';

export const getProductById = async event => {
    try {
        const { productId } = event.pathParameters;
        const product = productsList.find(p => p.id === productId);
        if (product) {
            return {
                statusCode: 200,
                body: JSON.stringify(product),
            };
        } else {
            return {
                statusCode: 404,
                body: 'Product not found',
            };
        }
    } catch (e) {
        return {
            statusCode: 500,
            body: 'Server error',
        };
    }
};
