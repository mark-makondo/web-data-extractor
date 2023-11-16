const Config = {
    google: {
        CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    },

    backend: {
        URI: process.env.REACT_APP_AXIOS_SERVER,
    },
    socket: {
        BACKEND_URI: process.env.REACT_APP_BACKEND_SERVER,
        OPTION: {},
    },
};

export default Config;
