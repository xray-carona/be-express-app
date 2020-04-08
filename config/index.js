// Export environment variables
module.exports = {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    S3_BUCKET: process.env.S3_BUCKET,
    AWS_REGION: process.env.AWS_REGION,
    NODE_ENV:process.env.NODE_ENV,
    ML_BASE_URL:process.env.ML_BASE_URL,
    USER_IDS:process.env.USER_IDS,
    PASSWORDS:process.env.PASSWORDS
};