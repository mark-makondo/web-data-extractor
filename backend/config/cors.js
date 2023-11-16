import cors from 'cors';

export default cors({
    // origin: [process.env.FRONT_END_ORIGIN, process.env.FRONT_END_ORIGIN1],
    origin: '*',
    credentials: true,
    exposedHeaders: '*',
});
