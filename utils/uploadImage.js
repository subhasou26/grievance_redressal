const AWS = require("@aws-sdk/client-s3");

const s3 = new AWS.S3Client({
  region: "ap-south-1", // e.g., 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
s3.u;

async function uploadImageToS3(imageBase64, fileName) {
  const buffer = Buffer.from(
    imageBase64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const params =new AWS.PutObjectCommand( {
    Bucket: "complaint-grivance",
    Key: fileName, // Unique filename for the image
    Body: buffer,
    ContentEncoding: "base64", // Important for S3
    ContentType: "image/jpeg", // Or the type you expect

  });

  try {
    const uploadResult = await s3.send(params);
    
    return `https://complaint-grivance.s3.ap-south-1.amazonaws.com/${fileName}`; // URL of the uploaded image
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}

module.exports = uploadImageToS3;
