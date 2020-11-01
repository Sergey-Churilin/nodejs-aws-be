'use strict';

const { Client } = require('pg');
import { dbOptions, response } from '../config/config';

export const getProductsList = async event => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        console.log('Request: getProductsList');
        const query = `SELECT p.id, p.title, p.description, p.price, s.count 
                        FROM products p
                        JOIN stocks s ON s.product_id = p.id`;
        const { rows: products } = await client.query(query);

        response.statusCode = 200;
        response.body = JSON.stringify(products);

        return response;
    } catch (e) {
        response.statusCode = 500;
        response.body = 'Server error';
        return response;
    } finally {
        client.end();
    }
};
