import env from 'dotenv';

env.config()

export const {PORT , MONGODB_URI , JWT_SECRET , } = process.env