const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");
const { ErrorResponse } = require("../utils/common");
const { UserService } = require("../services");


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

const checkAuth = async (req, res, next) => {
    try {
        const response = await UserService.isAuthenticated(req.headers['x-access-token']);
        if (response) {
            req.user = response; /*== This will indicate down the API's that request is authenticated and this user is authenticated user ==*/
            next();
        }

    } catch (error) {
        console.log("From Middleware", error);
        return res
            .status(error.statusCode)
            .json(error);
    }
}

module.exports = {
    validateAuthRequest,
    checkAuth
}