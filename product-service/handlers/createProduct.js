'use strict';

const { Client } = require('pg');
import { dbOptions, response } from '../config/config';

export const createProduct = async event => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        console.log(`Request: createProduct, body: ${JSON.parse(event.body)}`)
        const { title, description, price } = JSON.parse(event.body);
        if (title && description && price){
            const query = `WITH ins AS (
                INSERT INTO products (title, description, price)
                VALUES('${title}', '${description}', ${price})
                RETURNING id)
                INSERT INTO stocks
                (product_id, count)
                SELECT id, 1
                FROM ins
                returning product_id AS id;`
            const { rows: products } = await client.query(query);
            if (products.length){
                const product = products[0];
                response.statusCode = 201;
                response.body = JSON.stringify(product);
            } else {
                throw new Error();
            }
        } else {
            response.statusCode = 400;
            response.body = 'Bad request';
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
