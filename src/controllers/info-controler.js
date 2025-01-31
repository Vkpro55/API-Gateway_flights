const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../utils/common")

function info(req, res) {
    try {
        SuccessResponse.data = "API is live";

        return res.status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = "Not Found";
        return res.status(StatusCodes.NOT_FOUND)
            .json(ErrorResponse);
    }
}

module.exports = {
    info
}