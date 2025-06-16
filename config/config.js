const dovenv = require('dotenv');
const path = require('path');

const envFile = `.env.${process.env.NODE_ENV}`;
dotenv.config({
    path: path.resolve(__dirname, `./${envFile}`)
});

module.exports = {
    // app: {
    //     env: 'development'
    // }
    // JWT_SECRET: process.env.JWT_SECRET
}