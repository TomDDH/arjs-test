import AWS from "aws-sdk";


AWS.config.region = process.env.REACT_APP_AWS_BUCKET_REGION; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: process.env.REACT_APP_POOL_ID,
});

// console.log(AWS)

const S3 = new AWS.S3({
  params: { Bucket: process.env.REACT_APP_AWS_BUCKET_NAME },
  region: process.env.REACT_APP_AWS_BUCKET_REGION,
});


export default S3
