
const { StatusCodes } = require("http-status-codes");
const { UserRepository, RoleRepostory } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { Auth } = require("../utils/helper");
const RoleRepository = require("../repositories/role-repository");
const { Enums } = require("../utils/common");
const { CUSTOMER, ADMIN } = Enums.USER_ROLES;

const userRepository = new UserRepository();
const roleRepostory = new RoleRepository();


async function create(data) {
    try {
        const user = await userRepository.create(data);
        const role = await roleRepostory.getRoleByName(CUSTOMER);
        user.addRole(role);

        return user;
    } catch (error) {
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }

        console.log("Error is: ", error);
        throw new AppError("Cannot create a new User object", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signin(data) {
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if (!user) {
            throw new AppError("No user is found for given email", StatusCodes.NOT_FOUND);
        }

        const passwordMatch = Auth.comparePassword(data.password, user.password);

        if (!passwordMatch) {
            throw new AppError("Invalid Password", StatusCodes.BAD_REQUEST);
        }

        const jwt = Auth.createToken({ id: user.id, email: user.email });

        return jwt;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token) {
    try {
        if (!token) {
            throw new AppError('Missing JWT token', StatusCodes.BAD_REQUEST);
        }
        const response = Auth.verifyToken(token);/*== Decoded payload: { id: 2, email: 'vinod@gmail.com', iat: 1738332959, exp: 1738336559 }==*/
        const user = await userRepository.get(response.id);
        if (!user) {
            throw new AppError('No user found', StatusCodes.NOT_FOUND);
        }
        return user.id;
    } catch (error) {
        if (error instanceof AppError) throw error;
        if (error.name == 'JsonWebTokenError') {
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST);
        }
        if (error.name == 'TokenExpiredError') {
            throw new AppError('JWT token expired', StatusCodes.BAD_REQUEST);
        }
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function addRoletoUser(data) {
    try {
        const user = await userRepository.get(data.userId);
        if (!user) {
            throw new AppError('No user found for given userId', StatusCodes.NOT_FOUND);
        }
        const role = await roleRepostory.getRoleByName(data.role);
        if (!role) {
            throw new AppError('No role found for given role', StatusCodes.NOT_FOUND);
        }

        user.addRole(role);
        return user;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAdmin(userId) {
    try {
        const user = await userRepository.get(userId);
        if (!user) {
            throw new AppError('No user found for given userId', StatusCodes.NOT_FOUND);
        }

        const adminRole = await roleRepostory.getRoleByName(ADMIN);
        if (!adminRole) {
            throw new AppError('No role found for mentioned role', StatusCodes.NOT_FOUND);
        }

        return user.hasRole(adminRole);
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    create,
    signin,
    isAuthenticated,
    addRoletoUser,
    isAdmin
}