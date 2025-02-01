const express = require('express');
const { rateLimit } = require('express-rate-limit');

const proxy = require('express-http-proxy');
const { User, Role } = require("./models");

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, /* 2 minutes = 3 request ==*/
    limit: 3,
    message: { error: 'Too many requests, please try again later.' },
});


app.use(limiter);

app.use('/flightsService', proxy(ServerConfig.FLIGHT_SERVICE, {
    proxyReqPathResolver: (req) => req.originalUrl.replace('/flightsService', ''),
}));

app.use('/bookingService', proxy(ServerConfig.BOOKING_SERVICE, {
    proxyReqPathResolver: (req) => req.originalUrl.replace('/bookingService', ''),
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);

    // let user = await User.findByPk(2);
    // let role = await Role.findByPk(2);

    // user.addRole(role);

    // console.log("User is:", user);
    // console.log("Role is:", role);
});

/**
 * user
 *  |
 *  localhost:5000 => API Gateway
 *  |
 * localhost:3000/api/v1/flights
 */