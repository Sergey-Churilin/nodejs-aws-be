'use strict';

import { Bucket } from '../common/getConfig';
import AWS from 'aws-sdk';
const csv = require('csv-parser');

export const importFileParser = event => {
    const s3 = new AWS.S3({
        signatureVersion: 'v4',
        region: 'eu-west-1'
    });

    const sqs = new AWS.SQS();
    event.Records.forEach(record => {
        const Key = record.s3.object.key;
        const s3Stream = s3.getObject({
           Bucket,
           Key
        }).createReadStream();

        s3Stream.pipe(csv())
           .on('data', data => {
               sqs.sendMessage({
                   QueueUrl: process.env.SQS_URL,
                   MessageBody: JSON.stringify({...data})
               }, (err) => {
                   if (err) {
                       console.log('SQS error occur ON DATA', err);
                   } else {
                       console.log(`Send message with: ${JSON.stringify(data)}`);
                   }
               })
               console.log('ON DATA', data);
           })
           .on('error', err => {
               console.log('ON ERROR', err);
           })
           .on('end', async () => {
               console.log(`All products parsed`);
               console.log(`Copy from ${Bucket}/${Key}`);

               await s3.copyObject({
                   Bucket,
                   CopySource: `${Bucket}/${Key}`,
                   Key: Key.replace('uploaded', 'parsed')
               }).promise();
               console.log(`Copied into ${Bucket}/${Key.replace('uploaded', 'parsed')}`);

               await s3.deleteObject({
                   Bucket,
                   Key
               }).promise();
           })
    });
};
