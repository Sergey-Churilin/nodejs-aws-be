'use strict';
import AWS from 'aws-sdk';
import { createProduct } from '../../product-service/services/product';

export const catalogBatchProcess = event => {
    const products = event.Records.map(({body}) => JSON.parse(body));
    products.forEach(async (p) => {
        await createProduct(p);
        const sns = new AWS.SNS({region: 'eu-west-1'});
        sns.publish({
            Subject: 'You are invited processed',
            Message: 'Products uploaded',
            TopicArn: process.env.SNS_ARN
        }, (err) => {
            if (err) {
                console.log('SNS error occur', err);
            } else {
                console.log('Send email to needed users');
            }
        });
    });
};
