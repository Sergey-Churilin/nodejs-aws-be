'use strict';

import { Bucket } from '../common/getConfig';
import AWS from "aws-sdk";

export const importProductsFile = async event => {
    const fileName = event.queryStringParameters.name;
    if (!fileName) {
        return {
            statusCode: 400,
            body: 'Bad request'
        }
    }
    const filePath = `uploaded/${fileName}`;
    const s3 = new AWS.S3({
        signatureVersion: 'v4',
        region: 'eu-west-1'
    });
    const params = {
        Bucket,
        Key: filePath,
        Expires: 60
    };

    try {
        const url = await s3.getSignedUrlPromise('putObject', params);
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: url
        }
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500,
            body: e.message
        }
    }
};
