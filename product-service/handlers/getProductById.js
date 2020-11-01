'use strict';
const { Client } = require('pg');
import { dbOptions, response } from '../config/config';

export const getProductById = async event => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        console.log(`Request: getProductById, params: ${event.pathParameters}`);
        const { productId } = event.pathParameters;
        const query = `SELECT p.id, p.title, p.description, p.price, s.count 
                        FROM products p
                        JOIN stocks s ON s.product_id = p.id
                        WHERE p.id = '${productId}'`;
        const { rows: products } = await client.query(query);
        if (products && products.length) {
            response.statusCode = 200;
            response.body = JSON.stringify(products[0]);
        } else {
            response.statusCode = 404;
            response.body = 'Product not found';
        }

        return response;
    } catch (e) {
        response.statusCode = 500;
        response.body = 'Server error';
        return response;
    } finally {
        client.end();
    }
};
