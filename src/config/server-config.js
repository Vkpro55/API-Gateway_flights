const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    SALTROUNDS: process.env.SALTROUNDS
}