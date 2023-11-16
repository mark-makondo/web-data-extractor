import fs from 'fs';
import fetch from 'node-fetch';

export const writeFile = (filename, data) => {
    try {
        const dir = 'files';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        fs.writeFile(`${dir}/${filename}`, data, (err) => {
            if (err) {
                console.log('There has been an error saving your configuration data.');
                console.log(err.message);
                return;
            }
            console.log('file saved successfully.');
        });
    } catch (error) {
        console.log('error write file', error);
        return null;
    }
};

export const appendFile = (filename, data) => {
    const dir = 'files';
    fs.appendFile(`${dir}/${filename}`, `${data}\n`, (err) => {
        if (err) throw err;
        console.log('Append saved!');
    });
};

export const fileExist = (filename) => {
    try {
        const dir = 'files';
        if (fs.existsSync(`${dir}/${filename}`)) return true;
        return false;
    } catch (error) {
        return false;
    }
};

export const readFile = (filename) => {
    try {
        const dir = 'files';
        return JSON.parse(fs.readFileSync(`${dir}/${filename}`, 'utf8'));
    } catch (error) {
        return null;
    }
};

export const saveImageToDisk = (url, host, filename) => {
    !fs.existsSync(`downloads/${host}`) && fs.mkdirSync(`downloads/${host}`);
    fetch(url)
        .then((res) => {
            const dest = fs.createWriteStream(`downloads/${filename}`);
            res.body.pipe(dest);
        })
        .catch((err) => {
            console.log(err);
        });
};

export const convertBase64ToPng = (filename, data) => {
    data = data.replace(/^data:image\/png;base64,/, '');
    fs.writeFile(`files/captcha/${filename}`, data, 'base64', function (err) {
        if (err) throw err;
        console.log('Base 64 image to PNG saved!');
    });
};

export const user_scrape_history = {
    details: [],
    followLinks: [],
    followLinksMultipleSelector: '',
};

export const userPuppeteer = {
    details: [],
};

// {
//     userId: id,
//     browsers: []
// }

export const socketWatcher = {
    io: null,
};
