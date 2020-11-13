'use strict';

const { Client } = require('pg');
import { dbOptions, response } from '../config/config';

export const createProduct = async event => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        console.log(`Request: createProduct, body: ${JSON.parse(event.body)}`)
        const { title, description, price, count } = JSON.parse(event.body);
        if (title && description && price) {
            await client.query('BEGIN');
            console.log('BEGIN')
            const result = await client.query(`
                    INSERT INTO products (title, description, price)
                    VALUES('${title}', '${description}', ${price})
                    returning id;
                `);
            const product_id = result.rows[0].id;
            console.log('product_id', product_id)
            await client.query(`
                    INSERT INTO stocks (product_id, count)
                    VALUES ('${product_id}', ${count || 1})
                `);
            await client.query('COMMIT');

            response.statusCode = 201;
            response.body = JSON.stringify(product_id);
        } else {
            response.statusCode = 400;
            response.body = 'Bad request';
        }
        return response;
    } catch (e) {
        await client.query('ROLLBACK');
        response.statusCode = 500;
        response.body = 'Server error';
        return response;
    } finally {
        client.end();
    }
};
