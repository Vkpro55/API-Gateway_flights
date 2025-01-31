const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");
const { ErrorResponse } = require("../utils/common");


const validateAuthRequest = (req, res, next) => {
    if (!req.body.name) {

        ErrorResponse.message = "Something went wrong while authenticating user.";
        ErrorResponse.error = new AppError(["Name not found in the incoming request."], StatusCodes.BAD_REQUEST);

        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
    }
    if (!req.body.email) {

        ErrorResponse.message = "Something went wrong while authenticating user.";
        ErrorResponse.error = new AppError(["Email not found in the incoming request."], StatusCodes.BAD_REQUEST);

        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
    }
    if (!req.body.password) {

        ErrorResponse.message = "Something went wrong while authenticating user.";
        ErrorResponse.error = new AppError(["Password not found in the incoming request."], StatusCodes.BAD_REQUEST);

        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
    }

    next();
}

module.exports = {
    validateAuthRequest
}