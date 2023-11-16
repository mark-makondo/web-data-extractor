import { createContext } from 'react';

import socketio from 'socket.io-client';
import config from 'constants/Config';

let { BACKEND_URI, OPTION } = config.socket;

export const socket = socketio.connect(BACKEND_URI, OPTION);
export const SocketContext = createContext();
