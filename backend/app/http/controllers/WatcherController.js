import { captchaSolver } from 'config/captcha';

// http://localhost:3001/send-captcha
// captcha
// url
export const saveCaptchaResult = async (req, res) => {
    try {
        let { _id } = req.user;
        const { url, captcha, browserId } = req.query;
        // console.log(browserId, url, captcha);
        const pageTitle = await captchaSolver(_id, browserId, url, captcha);
        // console.log(`Watcher Controller => ${pageTitle}`);
        // res.status(200).send(`Captcha was solved => ${isSolved}`);
        const result =
            pageTitle === 'Are you human?'
                ? { error: true, success: false, status: 'failed' }
                : { error: false, success: true, status: 'success' };
        res.status(200).send(result);
    } catch (error) {
        console.log('receiveCaptchaResult', error);
    }
};

// watcherController->captcha->puppeteer
