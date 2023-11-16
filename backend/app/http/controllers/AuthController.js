import User from 'app/models/User';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import Puppeteer from 'config/puppeteer-new';

/**
 * function to create a jwt then send it to client.
 */
const sendJwt = (data, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    let jwt_token = jwt.sign(data, JWT_SECRET, {
        expiresIn: 604800, // 1 week
    });

    return res.status(200).header('jwt_token', jwt_token).send({ jwt_token, result: data });
};

/**
 * user login
 */
export const postLogin = asyncHandler(async (req, res) => {
    // // old code for session
    // const user = await User.findOne({ email: req.body.email }).select('+password').exec();
    // await comparePassword(req.body.password, user.password);

    // req.session.user = await User.findOne({ email: req.body.email }).exec();
    // return res.status(200).json(req.session.user);

    // new
    let user, userWithPass, validPassword;
    let { email, password } = req.body;

    userWithPass = await User.findOne({ email }).select('+password').exec();
    if (!userWithPass) return res.status(400).send(`Email doesn't exist.`);
    if (!password) return res.status(400).send(`Password is empty.`);

    validPassword = await bcrypt.compare(password, userWithPass.password);
    if (!validPassword) return res.status(400).send('Invalid password.');

    user = await User.findOne({ email: req.body.email }).exec();
    sendJwt(user.toJSON(), res);
});

/**
 * user google login
 */
export const postGoogleLogin = asyncHandler(async (req, res) => {
    let client, user, decodedToken, GOOGLE_CLIENT_ID, formatToSend;
    let { token } = req.body;

    GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

    client = new OAuth2Client(GOOGLE_CLIENT_ID);

    if (!token) return res.status(400).send('Token not found.');

    decodedToken = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    let { given_name, family_name, email, picture } = decodedToken.getPayload();

    user = await User.findOne({ email });

    formatToSend = {
        firstname: given_name,
        lastname: family_name,
        email,
        avatar: picture,
    };

    if (!user) {
        return res.send({
            proceed: true,
            ...formatToSend,
        });
    }

    // // old code for session
    // req.session.user = user;
    // return res.status(201).send();

    sendJwt({ _id: user._id, ...formatToSend }, res);
});

// // this is only applicable if session is used since on local storagae it is handled on the client for logout
// export const postLogoutUser = asyncHandler(async (req, res) => {
// 	req.session.destroy();
// 	return res.status(204).send();
// });

export const postRegister = asyncHandler(async (req, res) => {
    // // old code
    // await confirmPassword(req.body.password, req.body.confirmpassword);
    // await new User({ ...req.body }).save();
    // return res.status(201).send('User Created');

    // new
    let { email, password, confirmpassword, firstname, lastname, type } = req.body;
    let isEmailExist, user, savedUser;

    if (!firstname || !lastname || !email || !password || !confirmpassword)
        return res.status(400).send('Empty fields not allowed.');

    isEmailExist = await User.findOne({ email });
    if (isEmailExist) return res.status(400).send('Email already exists!');

    if (password !== confirmpassword) return res.status(400).send('Password  do not match.');

    user = new User({ ...req.body });

    savedUser = await user.save();

    if (type === 'google-register') return sendJwt(savedUser.toJSON(), res);
    return res.status(201).send('User created.');
});

export const userLogout = async (req) => {
    try {
        const { _id } = req.user;

        const puppeteer = new Puppeteer();
        await puppeteer.closeUserBrowsers(_id);
    } catch (error) {
        console.log('user logout error');
    }
};
