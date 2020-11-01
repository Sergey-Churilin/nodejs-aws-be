'use strict';
import { productsList } from '../localDb/productsList';

export const getProductsList = async event => {
    try {
        return {
            statusCode: 200,
            body: JSON.stringify(productsList),
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: 'Server error',
        };
    }
};
