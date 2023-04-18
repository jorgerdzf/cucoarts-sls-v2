'use strict';

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.APP_ACCESS_KEY,
  secretAccessKey: process.env.APP_SECRET,
}); 

const bucketName = process.env.BUCKET;
const maxDepth = 6; // Maximum number of folder layers to traverse
const maxResults = 300; // Maximum number of results to return

const s3 = new AWS.S3({ region: "us-east-2" });

function getObjectUrl(objectKey) {
  return s3.getSignedUrl('getObject', {
    Bucket: bucketName,
    Key: objectKey,
    Expires: 3600 // URL expiration time in seconds
  });
}

function listObjects(params, allObjects=[]) {
  return s3.listObjectsV2(params).promise()
    .then((data) => {
      const objects = data.Contents.filter((object) => {
        return object.Key.match(/\.(jpg|jpeg|png|gif)$/i);
      }).map((object) => {
        return {
          name: object.Key.split('/').pop(),
          url: getObjectUrl(object.Key)
        };
      });
      allObjects.push(...objects);

      if (data.IsTruncated) {
        params.ContinuationToken = data.NextContinuationToken;
        return listObjects(params, allObjects);
      }

      return allObjects;
    })
    .catch((err) => {
      console.error(err);
    });
}

async function listAllObjects(prefix='', depth=0, limit) {
  if (depth >= maxDepth || (limit && limit <= 0)) {
    return Promise.resolve([]);
  }

  const params = {
    Bucket: bucketName,
    Prefix: prefix
  };

  return listObjects(params)
    .then((objects) => {
      return objects;
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports.getArt = async (event,context,callback) => {
  console.log('----- EVENT: getArt -----');

  const images = await listAllObjects('', 0, maxResults)
  .then((objects) => {
    const initialPosition = Math.floor(Math.random() * maxResults);
    return objects.slice(initialPosition,initialPosition+20);
  });

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      message: 'Images form server',
      data: images,
    }),
  };
  console.log('----- END EVENT: getArt -----');

  callback(null, response);
};
