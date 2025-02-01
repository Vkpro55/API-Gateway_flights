const express = require('express');
const { rateLimit } = require('express-rate-limit');


const { createProxyMiddleware } = require('http-proxy-middleware');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, /* 2 minutes = 3 request ==*/
    limit: 3,
    message: { error: 'Too many requests, please try again later.' },
});

const flightServiceProxyMiddleware = createProxyMiddleware({
    target: ServerConfig.FLIGHT_SERVICE,
    changeOrigin: true,
});

const bookingServiceProxyMiddleware = createProxyMiddleware({
    target: ServerConfig.BOOKING_SERVICE,
    changeOrigin: true,
});

app.use(limiter);
app.use('/flightsService', flightServiceProxyMiddleware);
app.use("/bookingService", bookingServiceProxyMiddleware);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});

/**
 * user
 *  |
 *  localhost:5000 => API Gateway
 *  |
 * localhost:3000/api/v1/flights
 */