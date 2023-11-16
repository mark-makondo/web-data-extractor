import 'dotenv/config';

import http from 'http';
import socket from 'socket.io';
import Express from 'config/express';
// import Session from 'config/session';
import Cors from 'config/cors';
import Mongoose from 'config/mongoose';
import routes from 'routes/api';
import socketInstance from './config/socket';
import { socketWatcher } from 'config/utils';

const mongoose = new Mongoose();
const app = new Express();

const server = http.createServer(app.server);

const io = socket(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
    transports: ['polling'],
});

socketInstance(io);
socketWatcher.io = io;

// server.callback = (instance) => {
//     console.log(`Express is running at ${instance.address().address}:${instance.address().port}`);
// };

mongoose.connected = () => {
    console.log('Mongoose is running');
};

// server.setting("trust proxy", 1);
// server.useMiddleware(Session);
app.useMiddleware(Cors);

app.bodyParser();
app.urlEncoded();

app.processRoutes(routes);

const PORT = 3001;
// server.customError();

// //! for production
// app.useProduction();

server.listen(PORT, () => console.log(`Server running on port: ${PORT}.`));

// app.start();
mongoose.start();
