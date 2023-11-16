import User from 'app/models/User';
import ScrapedData from 'app/models/ScrapedData';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';

//** USER PROFILE ACTIONS **//

/**
 * get current user data.
 */
export const getCurrent = asyncHandler(async (req, res) => {
    // // old code for session
    // return res.status(200).json(req.session.user);

    let id = req.user._id;

    let findSingleUser = await User.findById(id);
    if (!findSingleUser) return res.status(403).send('User not found.');

    return res.status(200).send(findSingleUser);
});

/**
 * update current user data.
 * required body: object that is either 'firstname' || 'lastname' || 'email' || 'avatar' or all of them.
 */
export const putUpdate = asyncHandler(async (req, res) => {
    let _id = req.user._id;

    let findUserAndUpdate = await User.findOneAndUpdate({ _id }, req.body, {
        new: true,
        useFindAndModify: false,
    });

    if (!findUserAndUpdate) return res.status(400).send('Update failed.');

    return res.sendStatus(200);
});

/**
 * update current user password.
 * required body: object that contains 'currentPassword' && 'newPassword'.
 */
export const putChangePassword = asyncHandler(async (req, res) => {
    let validPassword, validNewPassword, userWithPass, salt, hashedNewPassword, updatePassword;
    let _id = req.user._id;
    let { currentPassword, newPassword } = req.body;

    userWithPass = await User.findOne({ _id }).select('+password').exec();

    if (!currentPassword) return res.status(400).send('Current password is empty.');
    if (!newPassword) return res.status(400).send('New password is empty.');

    validPassword = await bcrypt.compare(currentPassword, userWithPass.password);
    if (!validPassword) return res.status(400).send('Invalid password.');

    validNewPassword = await bcrypt.compare(newPassword, userWithPass.password);
    if (validNewPassword) return res.status(400).send('Previous password is not allowed.');

    salt = await bcrypt.genSalt(10);
    hashedNewPassword = await bcrypt.hash(newPassword, salt);

    updatePassword = await userWithPass.updateOne({ password: hashedNewPassword });
    if (!updatePassword) return res.status(400).send('Password update failed.');

    return res.status(200).send({ password: hashedNewPassword });
});

//** USER SCRAPED DATA ACTIONS **//

/**
 * get scraped data.
 */
export const getScrapedData = asyncHandler(async (req, res) => {
    let filter, scrapedData;
    let { _id } = req.user;

    filter = { owner: _id };
    scrapedData = await ScrapedData.find(filter);

    return res.status(200).send(scrapedData);
});

/**
 * new scraped data.
 */
export const postScrapedData = asyncHandler(async (req, res) => {
    let scrapedData, saved;

    let { saveDoc, title, origin } = req.body;
    let owner = req.user._id;

    scrapedData = new ScrapedData({ owner, title, origin, savedDoc: saveDoc });
    saved = await scrapedData.save();

    return res.status(200).send(saved);
});

/**
 * used in WebScrapeController
 */
export const scrapedDataExist = asyncHandler(async (data) => {
    let { owner, origin, savedDoc, title } = data;

    const scrapedData = await ScrapedData.find({
        $or: [
            {
                $and: [{ owner: owner }, { origin: origin }, { savedDoc: savedDoc }],
            },
            {
                $and: [{ owner: owner }, { origin: origin }, { title: title }],
            },
        ],
    });

    return scrapedData.length > 0 ? true : false;
});

/**
 * remove scraped data.
 * required parameter is either: 'all' or the id of the data.
 */
export const removeScrapedData = asyncHandler(async (req, res) => {
    let { _id } = req.user;
    let { remove } = req.body;

    if (remove === 'all') {
        let filter = { owner: _id };

        await ScrapedData.deleteMany(filter);
    } else {
        await ScrapedData.deleteMany({ _id: { $in: [...remove] } });
    }

    return res.sendStatus(200);
});
